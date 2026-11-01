import { useEffect, useRef } from 'react';

export default function TarefaModal({ tarefa, onSalvar, onFechar, loading }) {
  const isEdicao = !!tarefa?.id;
  const formRef = useRef(null);

  // Fechar modal ao pressionar Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onFechar]);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const dados = {
      titulo: fd.get('titulo'),
      descricao: fd.get('descricao') || undefined,
      dataConclusao: fd.get('dataConclusao') || undefined,
      ...(isEdicao && { concluida: fd.get('concluida') === 'true' }),
    };
    onSalvar(dados);
  }

  // Formata data_conclusao vinda do banco (ISO) para input date (YYYY-MM-DD)
  const dataInicial = tarefa?.data_conclusao
    ? tarefa.data_conclusao.split('T')[0]
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdicao ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              defaultValue={tarefa?.titulo || ''}
              required
              placeholder="O que precisa ser feito?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="descricao"
              defaultValue={tarefa?.descricao || ''}
              rows={3}
              placeholder="Detalhes adicionais (opcional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Data de conclusão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de conclusão
            </label>
            <input
              type="date"
              name="dataConclusao"
              defaultValue={dataInicial}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Status — só aparece na edição */}
          {isEdicao && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="concluida"
                defaultValue={tarefa.concluida ? 'true' : 'false'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="false">Pendente</option>
                <option value="true">Concluída</option>
              </select>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition font-semibold"
            >
              {loading ? 'Salvando…' : isEdicao ? 'Salvar alterações' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
