// Desafio_Estudiantes.jsx
import React, { useState, useEffect } from 'react';
import { Clock, LogOut, Target, List, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

// ===== CONFIGURA LA URL DE TU BACKEND DE LARAVEL =====
// Si tu backend corre en otro puerto, cambia el número 8000
const API_BASE_URL = 'http://localhost:8000';

const translations = {
    es: {
        timeLabel: "Tiempo restante",
        exitButton: "Salir",
        finishButton: "Finalizar",
        progressLabel: "Progreso en la categoría",
        questionsTitle: "Tareas de la categoría",
        exitModalTitle: "¿Salir del desafío?",
        exitModalText: "Si sales ahora, perderás todo tu progreso. ¿Estás seguro?",
        confirmExit: "Sí, salir",
        cancel: "Cancelar",
        completedTitle: "Desafío completado",
        congrats: "¡lo hiciste increíble!",
        noTasks: "No hay tareas disponibles para esta categoría.",
        finishModalTitle: "¿Finalizar desafío?",
        finishModalText: "¿Estás seguro de que quieres finalizar?",
        apiError: "Error de conexión con el servidor. Verifica que el backend de Laravel esté corriendo en el puerto correcto."
    }
};

const Desafio_Estudiantes = (props) => {
    const { studentData, onBackToPanel, language = 'es', contestConfig, categoryId, categoryName } = props;
    const t = translations[language] || translations.es;

    const [name] = useState(studentData?.name || 'Estudiante');
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----- Temporizador -----
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

    const handleFinalizar = () => {
        setFinished(true);
        setShowFinishModal(false);
        localStorage.removeItem(`bebrasTime_cat_${categoryId}`);
        setFinalScore(0);
    };

    const confirmExit = () => {
        localStorage.removeItem(`bebrasTime_cat_${categoryId}`);
        onBackToPanel && onBackToPanel();
    };

    const trimString = (str) => {
        return str ? String(str).trim() : '';
    };

    // ----- CARGA DE DATOS CON URL ABSOLUTA AL BACKEND -----
    useEffect(() => {
        const cargarDatos = async () => {
            const contestId = contestConfig?.id || localStorage.getItem('current_contest_id') || 1;
            console.log("🔍 contestId:", contestId, "categoryId:", categoryId);

            try {
                setLoading(true);
                setError(null);

                // Usamos URL absoluta para que vaya directo a Laravel
                const url = `${API_BASE_URL}/api/contest_tasks`;
                console.log(`📡 Solicitando: ${url}`);
                const response = await axios.get(url);
                console.log("📦 Respuesta del backend:", response.data);

                // Si la respuesta es HTML (por error de conexión), lanzar error
                if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
                    throw new Error(t.apiError);
                }

                // Extraer tareas (manejando diferentes estructuras)
                let allTasks = [];
                if (Array.isArray(response.data)) {
                    allTasks = response.data;
                } else if (response.data && typeof response.data === 'object') {
                    if (Array.isArray(response.data.data)) {
                        allTasks = response.data.data;
                    } else if (Array.isArray(response.data.tasks)) {
                        allTasks = response.data.tasks;
                    } else {
                        allTasks = Object.values(response.data).filter(item => typeof item === 'object' && item !== null);
                    }
                }
                console.log("📦 Tareas extraídas:", allTasks.length);
                if (allTasks.length > 0) console.log("Ejemplo de tarea:", allTasks[0]);

                if (allTasks.length === 0) {
                    console.warn("⚠️ No hay tareas en la base de datos.");
                    setQuestions([]);
                    setLoading(false);
                    return;
                }

                // Filtrar por categoría (ignorando contest_id para depurar)
                const filteredByCategory = allTasks.filter(task => Number(task.category_id) === Number(categoryId));
                console.log(`🔎 Tareas con categoría ${categoryId}:`, filteredByCategory.length);

                if (filteredByCategory.length === 0) {
                    console.warn(`⚠️ No hay tareas para la categoría ${categoryId}.`);
                    setQuestions([]);
                    setLoading(false);
                    return;
                }

                // Cargar tasks.json desde el frontend
                console.log("📂 Cargando /tasks.json");
                const jsonResponse = await fetch('/tasks.json');
                if (!jsonResponse.ok) {
                    throw new Error(`Error al cargar tasks.json: ${jsonResponse.status}`);
                }
                const jsonData = await jsonResponse.json();
                const rawTasks = jsonData.tasks || [];
                console.log("📄 Tareas en el JSON:", rawTasks.length);

                // Mapeo de categorías (texto -> id)
                const categoryMap = {
                    "Super-Peque": 1,
                    "Peque": 2,
                    "Benjamin": 3,
                    "Cadete": 4,
                    "Junior": 5,
                    "Senior": 6
                };

                // Construir preguntas cruzando datos
                const formattedQuestions = filteredByCategory.map((serverTask) => {
                    const codigoLimpio = trimString(serverTask.task_code);
                    console.log(`🔎 Buscando match para task_code: "${codigoLimpio}"`);

                    const taskDetails = rawTasks.find(t => {
                        const codeMatch = trimString(t.taskCode) === codigoLimpio;
                        const catTexto = t.category || '';
                        const catIdJSON = categoryMap[catTexto];
                        const match = codeMatch && catIdJSON === Number(categoryId);
                        if (match) {
                            console.log(`✅ Match encontrado: ${codigoLimpio} -> ${t.title}`);
                        }
                        return match;
                    });

                    if (taskDetails) {
                        return {
                            id: serverTask.id,
                            task_code: serverTask.task_code,
                            name: taskDetails.title || taskDetails.name || `Tarea ${codigoLimpio}`,
                            text: taskDetails.description || taskDetails.text || 'Sin descripción.',
                            type: taskDetails.type || 'text',
                            options: Array.isArray(taskDetails.options) ? taskDetails.options : [],
                            answer: taskDetails.correctOption || taskDetails.correctAnswer || '',
                            image: taskDetails.images?.[0] || null,
                            display_order: Number(serverTask.display_order) || 1
                        };
                    } else {
                        console.warn(`⚠️ No se encontró match para ${codigoLimpio}. Se usará título genérico.`);
                        return {
                            id: serverTask.id,
                            task_code: serverTask.task_code,
                            name: `Tarea ${codigoLimpio}`,
                            text: 'Información no disponible',
                            type: 'text',
                            options: [],
                            answer: '',
                            image: null,
                            display_order: Number(serverTask.display_order) || 1
                        };
                    }
                });

                formattedQuestions.sort((a, b) => a.display_order - b.display_order);
                console.log("✅ Preguntas formateadas:", formattedQuestions.length);
                setQuestions(formattedQuestions);
                setLoading(false);

            } catch (error) {
                console.error("❌ Error:", error);
                setError(error.message || "Error al cargar los datos.");
                toast.error("Error al cargar los datos.");
                setLoading(false);
            }
        };

        cargarDatos();
    }, [contestConfig, categoryId]);

    // ----- Renderizado (igual que antes) -----
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500 font-medium animate-pulse">Cargando tareas de {categoryName}...</div>
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
                        <span className="text-4xl font-extrabold text-blue-600">0 / {questions.length}</span>
                    </div>
                    <button onClick={onBackToPanel} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors cursor-pointer">
                        Volver al Panel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

            {/* Barra de progreso */}
            <div className="bg-white border-b border-gray-100 px-4 py-3">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between text-sm mb-1 font-medium">
                        <span className="text-gray-500">{t.progressLabel}</span>
                        <span className="text-green-600">0 / {questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `0%` }}></div>
                    </div>
                </div>
            </div>

            {/* Lista de títulos */}
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <List size={18} /> {t.questionsTitle}
                        </h3>
                        <p className="text-xs text-gray-500">Listado de tareas de la categoría</p>
                    </div>

                    {error && (
                        <div className="p-4 text-red-600 bg-red-50 border-b border-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {questions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 font-medium">
                            {t.noTasks}
                            {!error && (
                                <div className="mt-2 text-xs text-gray-300">
                                    (No se encontraron tareas en la base de datos para esta categoría)
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className="p-4 flex items-center justify-between cursor-default hover:bg-blue-50/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-500">
                                            {q.display_order || idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{q.name}</p>
                                            <span className="text-xs text-gray-400">Código: {q.task_code}</span>
                                        </div>
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
};

export default Desafio_Estudiantes;