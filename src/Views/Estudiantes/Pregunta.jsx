// Pregunta.jsx
import React from 'react';
import { Send, CheckCircle, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';

const Pregunta = ({
                      question,
                      questionNumber,
                      answer,
                      isSubmitted,
                      onAnswerChange,
                      onSubmit,
                      onPrevious,
                      onNext,
                      isFirst,
                      isLast
                  }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                    Pregunta {questionNumber}
                </h2>
                <p className="text-slate-700 text-lg">{question.text}</p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Edit3 size={16} /> Tu respuesta:
                </label>
                <input
                    type="text"
                    value={answer || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    placeholder="Escribe aquí tu respuesta..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <div className="flex items-center gap-3 mt-3">
                    <button
                        onClick={onSubmit}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
                    >
                        <Send size={16} /> Enviar respuesta
                    </button>
                    {isSubmitted && (
                        <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle size={14} /> Respuesta guardada
            </span>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                    disabled={isFirst}
                    onClick={onPrevious}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} /> Anterior
                </button>
                <span className="text-sm text-slate-500">
          {questionNumber} / {questionNumber + (isLast ? 0 : 1)}
        </span>
                <button
                    disabled={isLast}
                    onClick={onNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Siguiente <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pregunta;