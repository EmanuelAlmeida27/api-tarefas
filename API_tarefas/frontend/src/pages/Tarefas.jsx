import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TarefaCard from '../components/TarefaCard';
import TarefaModal from '../components/TarefaModal';
import Spinner from '../components/Spinner';

const FILTROS = [
  { label: 'Todas', valor: 'todas' },
  { label: 'Pendentes', valor: 'pendentes' },
  { label: 'Concluídas', valor: 'concluidas' },
];

export default function Tarefas() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [filtro, setFiltro] = useState('todas');
  const [busca, setBusca] = useState('');

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null); // null = nova tarefa
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState('');

  // ---------- Carregar tarefas ----------
  const carregarTarefas = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const { data } = await api.get('/tarefas');
      setTarefas(data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setErro('Não foi possível carregar as tarefas.');
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  // ---------- Logout ----------
  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch (_) { /* ignora erro */ }
    logout();
    navigate('/login');
  }

  // ---------- Filtro + Busca ----------
  const tarefasFiltradas = tarefas
    .filter((t) => {
      if (filtro === 'pendentes') return !t.concluida;
      if (filtro === 'concluidas') return t.concluida;
      return true;
    })
    .filter((t) =>
      t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (t.descricao || '').toLowerCase().includes(busca.toLowerCase())
    );

  // ---------- Toggle conclusão ----------
  async function handleToggle(tarefa) {
    try {
      await api.patch(`/tarefas/${tarefa.id}`, { concluida: !tarefa.concluida });
      setTarefas((prev) =>
        prev.map((t) => (t.id === tarefa.id ? { ...t, concluida: !t.concluida } : t))
      );
    } catch (err) {
      alert('Erro ao atualizar tarefa.');
    }
  }

  // ---------- Excluir ----------
  async function handleExcluir(id) {
    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Erro ao excluir tarefa.');
    }
  }

  // ---------- Abrir modal ----------
  function abrirNova() {
    setTarefaEditando(null);
    setErroModal('');
    setModalAberto(true);
  }

  function abrirEdicao(tarefa) {
    setTarefaEditando(tarefa);
    setErroModal('');
    setModalAberto(true);
  }

  // ---------- Salvar (criar ou editar) ----------
  async function handleSalvar(dados) {
    setSalvando(true);
    setErroModal('');
    try {
      if (tarefaEditando) {
        // PUT — edição completa
        const payload = {
          titulo: dados.titulo,
          descricao: dados.descricao ?? '',
          dataConclusao: dados.dataConclusao ?? tarefaEditando.data_conclusao?.split('T')[0] ?? '',
          concluida: dados.concluida,
        };
        const { data } = await api.put(`/tarefas/${tarefaEditando.id}`, payload);
        setTarefas((prev) =>
          prev.map((t) => (t.id === tarefaEditando.id ? data.tarefa : t))
        );
      } else {
        // POST — nova tarefa
        const payload = {
          titulo: dados.titulo,
          ...(dados.descricao && { descricao: dados.descricao }),
          ...(dados.dataConclusao && { dataConclusao: dados.dataConclusao }),
        };
        const { data } = await api.post('/tarefas', payload);
        setTarefas((prev) => [data.tarefa, ...prev]);
      }
      setModalAberto(false);
    } catch (err) {
      setErroModal(err.response?.data?.erro || 'Erro ao salvar tarefa.');
    } finally {
      setSalvando(false);
    }
  }

  // ---------- Estatísticas ----------
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Minhas Tarefas</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', valor: total, cor: 'blue' },
            { label: 'Pendentes', valor: pendentes, cor: 'amber' },
            { label: 'Concluídas', valor: concluidas, cor: 'green' },
          ].map(({ label, valor, cor }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold text-${cor}-600`}>{valor}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Busca */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tarefas…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                onClick={() => setFiltro(f.valor)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition
                  ${filtro === f.valor
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Botão nova tarefa */}
          <button
            onClick={abrirNova}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova tarefa
          </button>
        </div>

        {/* Erro de carregamento */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm flex items-center justify-between">
            {erro}
            <button onClick={carregarTarefas} className="text-red-600 underline ml-4">Tentar novamente</button>
          </div>
        )}

        {/* Lista de tarefas */}
        {loading ? (
          <Spinner />
        ) : tarefasFiltradas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">
              {busca ? 'Nenhuma tarefa encontrada para essa busca.' : 'Nenhuma tarefa aqui ainda.'}
            </p>
            {!busca && (
              <button onClick={abrirNova} className="mt-3 text-blue-600 underline text-sm">
                Criar primeira tarefa
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tarefasFiltradas.map((tarefa) => (
              <TarefaCard
                key={tarefa.id}
                tarefa={tarefa}
                onToggle={handleToggle}
                onEditar={abrirEdicao}
                onExcluir={handleExcluir}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalAberto && (
        <TarefaModal
          tarefa={tarefaEditando}
          onSalvar={handleSalvar}
          onFechar={() => setModalAberto(false)}
          loading={salvando}
          erro={erroModal}
        />
      )}
    </div>
  );
}
