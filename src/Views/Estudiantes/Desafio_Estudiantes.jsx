import React, { useState, useEffect } from 'react';
import { Clock, User, LogOut, Flag, CheckCircle, Send, ChevronLeft, ChevronRight, X, AlertCircle, Trophy, Award, ThumbsUp, Target, BookOpen, List, Edit3, Star } from 'lucide-react';

const Desafio_Estudiantes = (props) => {
    const { studentData, onBackToPanel } = props;
    const [name] = useState(studentData?.name || 'Estudiante');
    const [code] = useState(studentData?.code || '');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState({});
    const [evaluated, setEvaluated] = useState({});
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);

    const questions = [
        { id: 1, text: "Los castores construyen un puente con 3 troncos rojos y 2 azules. ¿Cuántos troncos usan en total?", type: "number", answer: "5" },
        { id: 2, text: "Un castor puede transportar 2 ramas por viaje. Si necesita mover 9 ramas, ¿cuántos viajes debe hacer?", type: "number", answer: "5" },
        { id: 3, text: "Observa la secuencia: rojo, amarillo, rojo, amarillo, rojo... ¿De qué color es la posición 10?", type: "text", answer: "amarillo" },
        { id: 4, text: "En el mapa del bosque, cada camino tiene 3 intersecciones. Si hay 4 caminos, ¿cuántas intersecciones hay en total?", type: "number", answer: "12" },
        { id: 5, text: "Si un castor tarda 5 minutos en talar un árbol, ¿cuántos minutos tardará en talar 4 árboles?", type: "number", answer: "20" }
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
        setAnswers({ ...answers, [currentQuestion]: value });
    };

    const handleSubmitQuestion = () => {
        if (!answers[currentQuestion]) {
            alert('Escribe tu respuesta antes de enviar');
            return;
        }
        setSubmitted({ ...submitted, [currentQuestion]: true });
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

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-sky-100 font-sans">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Target size={24} className="text-blue-600" />
                        <span className="font-bold text-slate-800">Desafío Bebras</span>
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

            <div className="max-w-7xl mx-auto p-4">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Lista de preguntas */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-4 h-fit">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><List size={18} className="text-blue-600" /> Preguntas</h3>
                        <div className="space-y-2">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all ${currentQuestion === idx ? 'bg-blue-50 border-2 border-blue-500 shadow-md' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-medium ${currentQuestion === idx ? 'text-blue-700' : 'text-slate-700'}`}>Pregunta {idx + 1}</span>
                                        <div className="flex items-center gap-2">
                                            {submitted[idx] && <CheckCircle size={14} className="text-green-500" />}
                                            <label className="flex items-center gap-1 text-xs cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={!!evaluated[idx]} onChange={() => toggleEvaluate(idx)} className="w-3.5 h-3.5" />
                                                <span className="text-slate-500">Evaluar</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                            <AlertCircle size={14} /> Marca "Evaluar" solo las preguntas que quieras que cuenten para tu puntaje
                        </div>
                    </div>

                    {/* Área de pregunta actual */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-blue-600 mb-2">Pregunta {questions[currentQuestion].id}</h2>
                            <p className="text-slate-700 text-lg">{questions[currentQuestion].text}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Edit3 size={16} /> Tu respuesta:
                            </label>
                            <input
                                type="text"
                                value={answers[currentQuestion] || ''}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                placeholder="Escribe aquí tu respuesta..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <div className="flex items-center gap-3 mt-3">
                                <button onClick={handleSubmitQuestion} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md">
                                    <Send size={16} /> Enviar respuesta
                                </button>
                                {submitted[currentQuestion] && (
                                    <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle size={14} /> Respuesta guardada</span>
                                )}
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                            <button
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={18} /> Anterior
                            </button>
                            <span className="text-sm text-slate-500">{currentQuestion + 1} / {questions.length}</span>
                            <button
                                disabled={currentQuestion === questions.length - 1}
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Siguiente <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal finalizar */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFinishModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 mb-4">
                            <Flag size={24} className="text-orange-500" />
                            <h3 className="text-xl font-bold text-slate-800">¿Finalizar desafío?</h3>
                        </div>
                        <p className="text-slate-600 mb-6">Recuerda marcar con ✓ las preguntas que quieres evaluar. Las no evaluadas no sumarán puntos.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowFinishModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
                            <button onClick={handleFinalizar} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md">Sí, finalizar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal salir */}
            {showExitModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExitModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 mb-4">
                            <LogOut size={24} className="text-red-500" />
                            <h3 className="text-xl font-bold text-slate-800">¿Salir del desafío?</h3>
                        </div>
                        <p className="text-slate-600 mb-6">Si sales ahora, perderás todo tu progreso. ¿Estás seguro?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowExitModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all">Seguir</button>
                            <button onClick={confirmExit} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-md">Sí, salir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Desafio_Estudiantes;