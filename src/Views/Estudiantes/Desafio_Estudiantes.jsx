// Desafio_Estudiantes.jsx
import React, { useState, useEffect } from 'react';
import { Clock, LogOut, Flag, CheckCircle, AlertCircle, Trophy, Target, List, ArrowLeft } from 'lucide-react';
import Pregunta from './Pregunta';
import { toast } from 'sonner';
import axios from 'axios';

const translations = {
    es: {
        timeLabel: "Tiempo restante",
        exitButton: "Salir",
        finishButton: "Finalizar",
        progressLabel: "Progreso en la categoría",
        answered: "preguntas respondidas",
        questionsTitle: "Preguntas del Desafío",
        clickHint: "Haz clic en cualquier pregunta para resolverla",
        evaluateLabel: "Evaluar",
        evaluateNote: "Solo las preguntas que tengan marcado \"Evaluar\" contarán para el resultado final",
        finishModalTitle: "¿Finalizar desafío?",
        finishModalText: "Antes de finalizar, verifica que hayas respondido todo correctamente.",
        cancel: "Cancelar",
        confirmFinish: "Sí, finalizar",
        exitModalTitle: "¿Salir del desafío?",
        exitModalText: "Si sales ahora, perderás todo tu progreso. ¿Estás seguro?",
        confirmExit: "Sí, salir",
        completedTitle: "Desafío completado",
        congrats: "¡lo hiciste increíble!",
        backToQuestions: "Volver a preguntas",
        answerRequired: "Debes responder la pregunta antes de enviar",
        answeredLabel: "Respondida"
    }
};

const Desafio_Estudiantes = (props) => {
    const { studentData, onBackToPanel, language = 'es', contestConfig, categoryId, categoryName } = props;
    const t = translations[language] || translations.es;

    const [name] = useState(studentData?.name || 'Estudiante');
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState({});
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);

    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    // Estados para las preguntas integradas
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [evaluated, setEvaluated] = useState({});

    useEffect(() => {
        const cargarDatosEIntegrar = async () => {
            // Salvaguarda por si contestConfig no cargó a tiempo desde el panel
            const contestId = contestConfig?.id || localStorage.getItem('current_contest_id') || 1;

            console.log("=== ENTRANDO AL DESAFÍO ===");
            console.log("Contest ID Buscado:", contestId);
            console.log("Categoría Seleccionada en el Panel (categoryId):", categoryId, "Tipo:", typeof categoryId);

            try {
                setLoading(true);

                // 1. Petición al Backend de Laravel (Ruta: /api/contest_tasks/{id})
                const responseBackend = await axios.get(`/api/contest_tasks/${contestId}`);
                const contestTasks = responseBackend.data.data || responseBackend.data || [];

                console.log("Tareas brutas recibidas de la BD:", contestTasks);

                // 2. Filtrar las tareas de la base de datos que correspondan a la categoría seleccionada
                // Forzamos comparación numérica robusta
                const filteredContestTasks = contestTasks.filter(task => {
                    return Number(task.category_id) === Number(categoryId);
                });

                console.log("Tareas de la BD filtradas por esta categoría:", filteredContestTasks);

                // 3. Obtener el archivo tasks.json desde la carpeta public del Frontend
                const responseJSON = await axios.get('/tasks.json');
                const bancoPreguntasJSON = responseJSON.data;

                console.log("Estructura del archivo tasks.json cargado:", bancoPreguntasJSON);

                // 4. Cruzar la información (Hacer el Match definitivo)
                const formattedQuestions = [];

                filteredContestTasks.forEach((ct) => {
                    const codigoLimpio = ct.task_code.trim();
                    let infoTareaJSON = null;

                    // Escenario A: Si el tasks.json es una lista/array plano: [ {}, {}, {} ]
                    if (Array.isArray(bancoPreguntasJSON)) {
                        infoTareaJSON = bancoPreguntasJSON.find(t => {
                            const codeJSON = (t.code || t.task_code || '').toString().trim();
                            const catJSON = t.category_id ?? t.categoryId ?? t.category;

                            // Comparamos ignorando mayúsculas/minúsculas y forzando números
                            return codeJSON.toLowerCase() === codigoLimpio.toLowerCase() && Number(catJSON) === Number(categoryId);
                        });
                    }
                    // Escenario B: Si el tasks.json es un objeto indexado por llaves de códigos: { "TASK01": {}, "TASK02": {} }
                    else if (bancoPreguntasJSON && typeof bancoPreguntasJSON === 'object') {
                        // Buscamos directamente por la propiedad o recorremos sus llaves
                        const todasLasLlaves = Object.keys(bancoPreguntasJSON);
                        const llaveEncontrada = todasLasLlaves.find(k => k.trim().toLowerCase() === codigoLimpio.toLowerCase());

                        if (llaveEncontrada) {
                            const tareaCandidata = bancoPreguntasJSON[llaveEncontrada];
                            const catJSON = tareaCandidata.category_id ?? tareaCandidata.categoryId ?? tareaCandidata.category;
                            if (Number(catJSON) === Number(categoryId)) {
                                infoTareaJSON = { ...tareaCandidata, code: llaveEncontrada };
                            }
                        }
                    }

                    // Si hubo match exitoso, estructuramos la pregunta para la interfaz
                    if (infoTareaJSON) {
                        formattedQuestions.push({
                            id: ct.id,
                            task_code: codigoLimpio,
                            name: infoTareaJSON.title || infoTareaJSON.name || `Tarea ${codigoLimpio}`,
                            text: infoTareaJSON.description || infoTareaJSON.text || 'Sin descripción disponible.',
                            type: infoTareaJSON.type || 'text',
                            options: infoTareaJSON.options || [],
                            answer: infoTareaJSON.answer || infoTareaJSON.correct_answer || '',
                            image: infoTareaJSON.image || null,
                            display_order: Number(ct.display_order) || 1
                        });
                    } else {
                        console.warn(`⚠️ No se pudo emparejar el código "${codigoLimpio}" de la BD. Revisa si en tu tasks.json este código existe y tiene asignada la categoría numérica ${categoryId}`);
                    }
                });

                // Ordenar las preguntas finales según el display_order de la BD
                formattedQuestions.sort((a, b) => a.display_order - b.display_order);

                console.log("Preguntas finales listas para renderizar en pantalla:", formattedQuestions);
                setQuestions(formattedQuestions);

                // Inicializar estados de evaluación (Todos en true por defecto)
                const initEvaluated = {};
                formattedQuestions.forEach((_, idx) => {
                    initEvaluated[idx] = true;
                });
                setEvaluated(initEvaluated);

            } catch (error) {
                console.error("Error crítico en la integración:", error);
                toast.error("Hubo un problema al sincronizar las preguntas del desafío.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatosEIntegrar();
    }, [contestConfig, categoryId]);

    // Control de Tiempos y Temporizador
    useEffect(() => {
        if (timeLeft === null && !finished) {
            const savedTime = localStorage.getItem(`bebrasTime_cat_${categoryId}`);
            if (savedTime) {
                setTimeLeft(parseInt(savedTime));
            } else {
                setTimeLeft((contestConfig?.executionTime || 45) * 60);
            }
        }
    }, [contestConfig, finished, categoryId]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0 && !finished) {
            localStorage.setItem(`bebrasTime_cat_${categoryId}`, timeLeft);
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !finished) {
            handleFinalizar();
        }
    }, [timeLeft, finished, categoryId]);

    const formatTime = (seconds) => {
        if (seconds === null) return "--:--";
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
            toast.error(t.answerRequired);
            return;
        }
        if (selectedQuestion !== null) {
            setSubmitted({ ...submitted, [selectedQuestion]: true });
        }
    };

    const toggleEvaluate = (idx) => {
        setEvaluated(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleFinalizar = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (evaluated[idx] && answers[idx]) {
                if (answers[idx].toString().toLowerCase().trim() === q.answer.toString().toLowerCase().trim()) {
                    score++;
                }
            }
        });
        setFinalScore(score);
        setFinished(true);
        setShowFinishModal(false);
        localStorage.removeItem(`bebrasTime_cat_${categoryId}`);
    };

    const confirmExit = () => {
        localStorage.removeItem(`bebrasTime_cat_${categoryId}`);
        onBackToPanel && onBackToPanel();
    };

    const answeredCount = Object.keys(submitted).filter(key => submitted[key]).length;
    const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    if (loading || timeLeft === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500 font-medium animate-pulse">Sincronizando preguntas de {categoryName}...</div>
            </div>
        );
    }

    if (finished) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy size={40} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.completedTitle}</h2>
                    <p className="text-gray-600 mb-4">{name}, {t.congrats}</p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <span className="text-sm text-gray-500 block">Puntuación en {categoryName}:</span>
                        <span className="text-4xl font-extrabold text-blue-600">{finalScore} / {questions.length}</span>
                    </div>
                    <button onClick={onBackToPanel} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors cursor-pointer">
                        Volver al Panel
                    </button>
                </div>
            </div>
        );
    }

    if (selectedQuestion === null) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header Superior */}
                <div className="bg-white shadow-xs border-b border-gray-200 sticky top-0 z-10 px-4 py-3">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="text-blue-600" size={20} />
                            <span className="font-bold text-gray-800">{categoryName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-blue-700 font-mono font-bold border border-blue-100">
                                <Clock size={16} />
                                {formatTime(timeLeft)}
                            </div>
                            <button onClick={() => setShowExitModal(true)} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium cursor-pointer">
                                {t.exitButton}
                            </button>
                            <button onClick={() => setShowFinishModal(true)} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-xs cursor-pointer">
                                {t.finishButton}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progreso */}
                <div className="bg-white border-b border-gray-100 px-4 py-3">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between text-sm mb-1 font-medium">
                            <span className="text-gray-500">{t.progressLabel}</span>
                            <span className="text-green-600">{answeredCount} / {questions.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Lista de preguntas */}
                <div className="max-w-3xl mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><List size={18} /> {t.questionsTitle}</h3>
                            <p className="text-xs text-gray-500">{t.clickHint}</p>
                        </div>

                        {questions.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 font-medium">
                                No hay preguntas vinculadas en la base de datos para la categoría: {categoryName}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {questions.map((q, idx) => (
                                    <div
                                        key={q.id}
                                        onClick={() => setSelectedQuestion(idx)}
                                        className="p-4 hover:bg-blue-50/20 flex items-center justify-between cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${submitted[idx] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                                {submitted[idx] ? '✓' : q.display_order}
                                            </div>
                                            <div>
                                                {/* MUESTRA EL TITULO DE LA PREGUNTA EXTRAÍDO DEL JSON */}
                                                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors">{q.name}</p>
                                                <span className="text-xs text-gray-400">Código: {q.task_code}</span>
                                            </div>
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                                            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!evaluated[idx]}
                                                    onChange={() => toggleEvaluate(idx)}
                                                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                                {t.evaluateLabel}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modales */}
                {showFinishModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                            <h4 className="text-lg font-bold mb-2">{t.finishModalTitle}</h4>
                            <p className="text-sm text-gray-600 mb-4">{t.finishModalText}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setShowFinishModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium cursor-pointer">{t.cancel}</button>
                                <button onClick={handleFinalizar} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer">Finalizar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showExitModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                            <h4 className="text-lg font-bold mb-2 text-red-600">{t.exitModalTitle}</h4>
                            <p className="text-sm text-gray-600 mb-4">{t.exitModalText}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setShowExitModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium cursor-pointer">{t.cancel}</button>
                                <button onClick={confirmExit} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium cursor-pointer">{t.confirmExit}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => setSelectedQuestion(null)} className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 cursor-pointer">
                    <ArrowLeft size={16} /> {t.backToQuestions}
                </button>
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
                    language={language}
                />
            </div>
        </div>
    );
};

export default Desafio_Estudiantes;