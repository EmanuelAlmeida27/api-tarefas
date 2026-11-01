import { useState } from 'react';

// Formata data ISO (YYYY-MM-DD) para PT-BR (DD/MM/YYYY)
function formatarData(data) {
  if (!data) return null;
  const [ano, mes, dia] = data.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function TarefaCard({ tarefa, onToggle, onEditar, onExcluir }) {
  const [confirmando, setConfirmando] = useState(false);

  const dataFormatada = formatarData(tarefa.data_conclusao);

  const vencida =
    tarefa.data_conclusao &&
    !tarefa.concluida &&
    new Date(tarefa.data_conclusao) < new Date(new Date().toDateString());

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-5 transition hover:shadow-md
        ${tarefa.concluida ? 'opacity-60' : ''}
        ${vencida ? 'border-red-300' : 'border-gray-200'}`}
    >
      {/* Cabeçalho */}
      <div className="flex items-start gap-3">
        {/* Checkbox de conclusão */}
        <button
          onClick={() => onToggle(tarefa)}
          title={tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
          className="mt-0.5 flex-shrink-0"
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition
              ${tarefa.concluida
                ? 'bg-green-500 border-green-500'
                : 'border-gray-400 hover:border-blue-500'
              }`}
          >
            {tarefa.concluida && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-gray-800 leading-snug truncate
              ${tarefa.concluida ? 'line-through text-gray-400' : ''}`}
          >
            {tarefa.titulo}
          </h3>

          {tarefa.descricao && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
              {tarefa.descricao}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {tarefa.concluida ? (
              <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                ✓ Concluída
              </span>
            ) : (
              <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                ● Pendente
              </span>
            )}

            {dataFormatada && (
              <span
                className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium
                  ${vencida ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
              >
                📅 {vencida ? 'Vencida · ' : ''}{dataFormatada}
              </span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEditar(tarefa)}
            title="Editar tarefa"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {confirmando ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onExcluir(tarefa.id)}
                className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition"
              >
                Sim
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-300 transition"
              >
                Não
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              title="Excluir tarefa"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
