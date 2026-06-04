// PreguntaDividida.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, CheckCircle, Edit3, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

const translations = {
    es: {
        questionLabel: "Pregunta",
        instructions: "Instrucciones",
        statement: "Enunciado",
        yourAnswer: "Tu respuesta",
        placeholder: "Escribe aquí tu respuesta...",
        send: "Enviar respuesta",
        answerSaved: "Respuesta guardada",
        previous: "Anterior",
        next: "Siguiente",
        dragToResize: "Arrastra para ajustar"
    },
    en: {
        questionLabel: "Question",
        instructions: "Instructions",
        statement: "Statement",
        yourAnswer: "Your answer",
        placeholder: "Write your answer here...",
        send: "Submit answer",
        answerSaved: "Answer saved",
        previous: "Previous",
        next: "Next",
        dragToResize: "Drag to resize"
    },
    pt: {
        questionLabel: "Pergunta",
        instructions: "Instruções",
        statement: "Enunciado",
        yourAnswer: "Sua resposta",
        placeholder: "Escreva sua resposta aqui...",
        send: "Enviar resposta",
        answerSaved: "Resposta salva",
        previous: "Anterior",
        next: "Próximo",
        dragToResize: "Arraste para ajustar"
    },
    fr: {
        questionLabel: "Question",
        instructions: "Instructions",
        statement: "Énoncé",
        yourAnswer: "Votre réponse",
        placeholder: "Écrivez votre réponse ici...",
        send: "Envoyer la réponse",
        answerSaved: "Réponse enregistrée",
        previous: "Précédent",
        next: "Suivant",
        dragToResize: "Glisser pour ajuster"
    }
};

const Pregunta = ({
                              question,
                              questionNumber,
                              totalQuestions,
                              answer,
                              isSubmitted,
                              onAnswerChange,
                              onSubmit,
                              onPrevious,
                              onNext,
                              isFirst,
                              isLast,
                              language = 'es',
                              initialLeftWidth = 50 // porcentaje inicial para el panel izquierdo
                          }) => {
    const t = translations[language];
    const containerRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        const clampedWidth = Math.min(85, Math.max(15, newLeftWidth));
        setLeftWidth(clampedWidth);
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            // Cambiar el cursor global mientras se arrastra
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
                ref={containerRef}
                className="flex relative min-h-[500px]"
                style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}
            >
                {/* Panel izquierdo - Contenido de la pregunta */}
                <div
                    className="overflow-y-auto p-6"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="max-w-none">
                        {/* Encabezado de pregunta */}
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-blue-600 mb-2">
                                {t.questionLabel} {questionNumber}
                            </h2>
                            <p className="text-slate-500 text-sm">
                                {questionNumber} / {totalQuestions}
                            </p>
                        </div>

                        {/* Enunciado */}
                        <div className="mb-6">
                            <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                {t.statement}
                            </h3>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-800 text-lg leading-relaxed">
                                    {question.text}
                                </p>
                            </div>
                        </div>

                        {/* Instrucciones (si existen) */}
                        {question.instructions && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="text-md font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                     {t.instructions}
                                </h3>
                                <p className="text-blue-800 text-sm leading-relaxed">
                                    {question.instructions}
                                </p>
                            </div>
                        )}

                        {/* Material adicional o recursos (opcional) */}
                        {question.additionalResources && (
                            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                                <h3 className="text-sm font-semibold text-slate-600 mb-2">
                                     Recursos adicionales
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    {question.additionalResources}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Divisor vertical arrastrable */}
                <div
                    className={`relative w-2 cursor-col-resize bg-slate-200 hover:bg-blue-400 transition-colors flex-shrink-0 ${
                        isDragging ? 'bg-blue-500' : ''
                    }`}
                    onMouseDown={handleMouseDown}
                    style={{ cursor: 'col-resize' }}
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-white rounded-full p-1 shadow-md">
                            <GripVertical size={16} className="text-slate-400" />
                        </div>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-1 rounded">
                        {t.dragToResize}
                    </div>
                </div>

                {/* Panel derecho - Respuesta del alumno */}
                <div
                    className="overflow-y-auto p-6 bg-slate-50"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                    <div className="h-full flex flex-col">
                        <div className="mb-4 pb-3 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                <Edit3 size={18} /> {t.yourAnswer}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {isSubmitted ? t.answerSaved : "Escribe tu respuesta en el campo inferior"}
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            <textarea
                                value={answer || ''}
                                onChange={(e) => onAnswerChange(e.target.value)}
                                placeholder={t.placeholder}
                                className="w-full flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                style={{ minHeight: '200px' }}
                            />

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onSubmit}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
                                >
                                    <Send size={16} /> {t.send}
                                </button>
                                {isSubmitted && (
                                    <span className="flex items-center gap-1 text-sm text-green-600 animate-in fade-in duration-300">
                                        <CheckCircle size={14} /> {t.answerSaved}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Navegación entre preguntas */}
                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-200">
                            <button
                                disabled={isFirst}
                                onClick={onPrevious}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-slate-200"
                            >
                                <ChevronLeft size={18} /> {t.previous}
                            </button>
                            <span className="text-sm text-slate-400">
                                Pregunta {questionNumber} de {totalQuestions}
                            </span>
                            <button
                                disabled={isLast}
                                onClick={onNext}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-slate-200"
                            >
                                {t.next} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pregunta;