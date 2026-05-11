// Desafio_Estudiantes.jsx
import React, { useState, useEffect } from 'react';
import { Clock, User, LogOut, Flag, CheckCircle, AlertCircle, Trophy, ThumbsUp, Target, List, Star, Menu, ArrowLeft } from 'lucide-react';
import Pregunta from './Pregunta';
import {toast} from "sonner";

const Desafio_Estudiantes = (props) => {
    const { studentData, onBackToPanel } = props;
    const [name] = useState(studentData?.name || 'Estudiante');
    const [code] = useState(studentData?.code || '');
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState({});
    const [evaluated, setEvaluated] = useState({});
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Preguntas del desafío con nombres graciosos
    const questions = [
        {
            id: 1,
            name: "El puente loco de los castores",
            text: "Los castores construyen un puente con 3 troncos rojos y 2 azules. ¿Cuántos troncos usan en total?",
            type: "number",
            answer: "5"
        },
        {
            id: 2,
            name: "Castor repartidor",
            text: "Un castor puede transportar 2 ramas por viaje. Si necesita mover 9 ramas, ¿cuántos viajes debe hacer?",
            type: "number",
            answer: "5"
        },
        {
            id: 3,
            name: "La secuencia arcoiris del castor",
            text: "Observa la secuencia: rojo, amarillo, rojo, amarillo, rojo... ¿De qué color es la posición 10?",
            type: "text",
            answer: "amarillo"
        },
        {
            id: 4,
            name: "El bosque de las intersecciones",
            text: "En el mapa del bosque, cada camino tiene 3 intersecciones. Si hay 4 caminos, ¿cuántas intersecciones hay en total?",
            type: "number",
            answer: "12"
        },
        {
            id: 5,
            name: "El castor talador experto",
            text: "Si un castor tarda 5 minutos en talar un árbol, ¿cuántos minutos tardará en talar 4 árboles?",
            type: "number",
            answer: "20"
        }
    ];

    useEffect(() => {
        if (timeLeft > 0 && !finished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !finished) {
            handleFinalizar();
        }
    }, [timeLeft, finished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (value) => {
        if (selectedQuestion !== null) {
            setAnswers({ ...answers, [selectedQuestion]: value });
        }
    };

    const handleSubmitQuestion = () => {
        if (selectedQuestion !== null && !answers[selectedQuestion]) {
            toast.error("Debes responder la pregunta antes de enviar");
            return;
        }
        if (selectedQuestion !== null) {
            setSubmitted({ ...submitted, [selectedQuestion]: true });
        }
    };

    const toggleEvaluate = (qIndex) => {
        setEvaluated(prev => ({ ...prev, [qIndex]: !prev[qIndex] }));
    };

    const handleFinalizar = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (evaluated[idx] && answers[idx]) {
                const userAnswer = answers[idx].toString().toLowerCase().trim();
                const correctAnswer = q.answer.toString().toLowerCase().trim();
                if (userAnswer === correctAnswer) score++;
            }
        });
        setFinalScore(score);
        setFinished(true);
        setShowFinishModal(false);
    };

    const handleExit = () => setShowExitModal(true);
    const confirmExit = () => onBackToPanel && onBackToPanel();

    const handleSelectQuestion = (index) => {
        setSelectedQuestion(index);
    };

    const handleBackToList = () => {
        setSelectedQuestion(null);
    };

    const answeredCount = Object.keys(submitted).filter(key => submitted[key]).length;
    const progressPercentage = (answeredCount / questions.length) * 100;

    if (finished) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center animate-[fadeInUp_.4s_ease-out]">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy size={40} className="text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800">Desafío completado</h2>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                        <p className="text-slate-600 mb-2">✨ {name}, ¡lo hiciste increíble! ✨</p>
                        <div className="text-5xl font-bold text-blue-600 my-4">{finalScore} / {questions.length}</div>
                        {finalScore === questions.length ? (
                            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl"><Star size={20} /> ¡Perfecto! Eres un genio castor</div>
                        ) : finalScore >= questions.length / 2 ? (
                            <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl"><ThumbsUp size={20} /> ¡Buen trabajo! Sigue así</div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-xl"><Target size={20} /> ¡No te rindas! La práctica hace al maestro</div>
                        )}
                    </div>
                    <button onClick={onBackToPanel} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md">
                        <LogOut size={18} /> Volver
                    </button>
                </div>
            </div>
        );
    }

    // Vista de lista de preguntas
    if (selectedQuestion === null) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-100 to-sky-100 font-sans">
                {/* Header */}
                <div className="bg-white shadow-md sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                                <Target size={18} />
                            </div>
                            <span className="font-bold text-slate-800">Desafío BebrasCuba</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full">
                                <Clock size={16} className="text-orange-600" />
                                <span className="font-mono font-bold text-orange-700">{formatTime(timeLeft)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <User size={16} />
                                <span className="text-sm">{name}</span>
                            </div>
                            <button onClick={handleExit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all text-sm font-medium">
                                <LogOut size={14} /> Salir
                            </button>
                            <button onClick={() => setShowFinishModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-sm font-medium shadow-md">
                                <Flag size={14} /> Finalizar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="bg-white border-b border-slate-200 px-4 py-2">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">Progreso del desafío</span>
                            <span className="text-sm font-bold text-green-600">{answeredCount} de {questions.length} preguntas respondidas</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                                className="bg-green-500 rounded-full h-2.5 transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Lista de preguntas */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <List size={18} className="text-blue-600" />
                                Preguntas del desafío
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Haz clic en cualquier pregunta para resolverla</p>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                            {questions.map((q, idx) => {
                                const isAnswered = submitted[idx];
                                const isEvaluated = evaluated[idx];

                                return (
                                    <div
                                        key={q.id}
                                        onClick={() => handleSelectQuestion(idx)}
                                        className={`group flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-slate-50`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0
                                                ${isAnswered
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-500'
                                            }
                                            `}>
                                                {isAnswered ? '✓' : idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                                    {q.name}
                                                </p>
                                                {isAnswered && (
                                                    <span className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                                        <CheckCircle size={10} /> Respondida
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <label
                                                className="flex items-center gap-1.5 text-xs cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={!!evaluated[idx]}
                                                    onChange={() => toggleEvaluate(idx)}
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-slate-500">Evaluar</span>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 bg-blue-50 border-t border-blue-100">
                            <div className="flex items-start gap-2 text-xs text-blue-700">
                                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                <span>Marca "Evaluar" solo las preguntas que quieras que cuenten para tu puntaje final</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modales */}
                {showFinishModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFinishModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Flag size={20} className="text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">¿Finalizar desafío?</h3>
                            </div>
                            <p className="text-slate-600 mb-2">Antes de finalizar, verifica que:</p>
                            <ul className="text-sm text-slate-500 mb-6 ml-5 space-y-1 list-disc">
                                <li>Haz respondido todas las preguntas que deseas</li>
                                <li>Marca con ✓ las preguntas que quieres evaluar</li>
                                <li>Las preguntas no evaluadas no sumarán puntos</li>
                            </ul>
                            <div className="flex gap-3">
                                <button onClick={() => setShowFinishModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
                                <button onClick={handleFinalizar} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md">Sí, finalizar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showExitModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExitModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <LogOut size={20} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">¿Salir del desafío?</h3>
                            </div>
                            <p className="text-slate-600 mb-6">Si sales ahora, perderás todo tu progreso. ¿Estás seguro?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExitModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
                                <button onClick={confirmExit} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-md">Sí, salir</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Vista de pregunta individual
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-sky-100 font-sans">
            <div className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all font-medium"
                    >
                        <ArrowLeft size={18} /> Volver a la lista
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full">
                            <Clock size={16} className="text-orange-600" />
                            <span className="font-mono font-bold text-orange-700">{formatTime(timeLeft)}</span>
                        </div>
                        <button onClick={() => setShowFinishModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-sm font-medium shadow-md">
                            <Flag size={14} /> Finalizar
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-slate-200 px-4 py-2">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-600">Progreso del desafío</span>
                        <span className="text-sm font-bold text-green-600">{answeredCount} de {questions.length} preguntas respondidas</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                            className="bg-green-500 rounded-full h-2.5 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="w-full">
                    <Pregunta
                        question={questions[selectedQuestion]}
                        questionNumber={selectedQuestion + 1}
                        totalQuestions={questions.length}
                        answer={answers[selectedQuestion]}
                        isSubmitted={submitted[selectedQuestion]}
                        onAnswerChange={handleAnswerChange}
                        onSubmit={handleSubmitQuestion}
                        onPrevious={() => setSelectedQuestion(prev => prev - 1)}
                        onNext={() => setSelectedQuestion(prev => prev + 1)}
                        isFirst={selectedQuestion === 0}
                        isLast={selectedQuestion === questions.length - 1}
                    />
                </div>
            </div>

            {/* Modales */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFinishModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <Flag size={20} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">¿Finalizar desafío?</h3>
                        </div>
                        <p className="text-slate-600 mb-2">Antes de finalizar, verifica que:</p>
                        <ul className="text-sm text-slate-500 mb-6 ml-5 space-y-1 list-disc">
                            <li>Haz respondido todas las preguntas que deseas</li>
                            <li>Marca con ✓ las preguntas que quieres evaluar</li>
                            <li>Las preguntas no evaluadas no sumarán puntos</li>
                        </ul>
                        <div className="flex gap-3">
                            <button onClick={() => setShowFinishModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
                            <button onClick={handleFinalizar} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md">Sí, finalizar</button>
                        </div>
                    </div>
                </div>
            )}

            {showExitModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExitModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <LogOut size={20} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">¿Salir del desafío?</h3>
                        </div>
                        <p className="text-slate-600 mb-6">Si sales ahora, perderás todo tu progreso. ¿Estás seguro?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowExitModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
                            <button onClick={confirmExit} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-md">Sí, salir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Desafio_Estudiantes;