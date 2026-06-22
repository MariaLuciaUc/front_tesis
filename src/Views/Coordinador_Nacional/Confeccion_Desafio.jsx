import api from '../../api/axios';
import React, { useState, useEffect, useCallback } from 'react';
import {
    ArrowLeft,
    Save,
    BookOpen,
    Plus,
    Trash2,
    X,
    Clock,
    Settings,
    ChevronDown,
    Calendar,
    MessageSquare,
    Star,
    Edit3,
    Trophy,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

const translations = {
    es: {
        title: "Confección del Desafío",
        back: "Volver al panel",
        saveConfig: "Guardar configuración general del desafío",
        configSaved: "Configuración guardada exitosamente en el servidor",
        contestName: "Nombre del Concurso",
        startDate: "Fecha de Inicio",
        endDate: "Fecha de Finalización",
        executionTime: "Tiempo de Ejecución (minutos)",
        welcomeMessageTeacher: "Mensaje de Bienvenida - Profesores",
        welcomeMessageStudent: "Mensaje de Bienvenida - Estudiantes",
        selectLevel: "Seleccionar Nivel Bebras",
        questionsForLevel: "Preguntas para el nivel",
        noQuestions: "No hay preguntas agregadas para este nivel",
        addQuestion: "Agregar pregunta del banco",
        questionBank: "Banco de Preguntas",
        points: "pts",
        answer: "Respuesta correcta",
        editQuestion: "Editar pregunta",
        deleteQuestion: "Eliminar pregunta",
        selectFirst: "Seleccione un nivel para ver las preguntas",
        alreadyAdded: "Esta pregunta ya está agregada a este nivel",
        noMoreQuestions: "No hay más preguntas disponibles en el banco para este nivel",
        close: "Cerrar",
        scoringScheme: "Esquema de Puntuación",
        basePoints: "Puntos por pregunta correcta",
        timeBonus: "Bono por tiempo restante",
        negativePoints: "Penalización por respuesta incorrecta",
        levelConfiguration: "Configuración del Nivel",
        saveLevelConfig: "Guardar configuración del nivel",
        levelConfigSaved: "Configuración guardada para",
        pointsConfig: "Configuración de puntos",
        studentWelcome: "Bienvenida al estudiante",
        generalInfo: "Información General",
        bebrasCategory: "Categoría Bebras",
        saveFirst:  "Debes guardar la configuración general del Desafío en el panel izquierdo antes de asignar preguntas.",
        timeInMinutes: "Tiempo en minutos para esta categoría",
        errorEmptyTime: "❌ Debes configurar el tiempo de ejecución para la categoría antes de guardar. El tiempo no puede estar vacío o ser 0.",
        questionAdded: "Pregunta agregada exitosamente",
        questionRemoved: "Pregunta eliminada exitosamente",
        editPoints: "Editar puntos"
    },
    en: {
        title: "Challenge Configuration",
        back: "Back to panel",
        saveConfig: "Save challenge general configuration",
        configSaved: "Configuration saved successfully",
        contestName: "Contest Name",
        startDate: "Start Date",
        endDate: "End Date",
        executionTime: "Execution Time (minutes)",
        welcomeMessageTeacher: "Welcome Message - Teachers",
        welcomeMessageStudent: "Welcome Message - Students",
        selectLevel: "Select Bebras Level",
        questionsForLevel: "Questions for level",
        noQuestions: "No questions added for this level",
        addQuestion: "Add question from bank",
        questionBank: "Question Bank",
        points: "pts",
        answer: "Correct answer",
        editQuestion: "Edit question",
        deleteQuestion: "Delete question",
        selectFirst: "Select a level to view questions",
        alreadyAdded: "This question has already been added to this level",
        noMoreQuestions: "No more questions available in the bank for this level",
        close: "Close",
        scoringScheme: "Scoring Scheme",
        basePoints: "Points per correct answer",
        timeBonus: "Time remaining bonus",
        negativePoints: "Penalty for incorrect answer",
        levelConfiguration: "Level Configuration",
        saveLevelConfig: "Save level configuration",
        levelConfigSaved: "Configuration saved for",
        pointsConfig: "Points configuration",
        studentWelcome: "Student welcome message",
        generalInfo: "General Information",
        bebrasCategory: "Bebras Category",
        saveFirst: "You must save challenge general configuration in the left panel before assign questions",
        timeInMinutes: "Time in minutes for this category",
        errorEmptyTime: "❌ You must configure the execution time for the category before saving. Time cannot be empty or 0.",
        questionAdded: "Question added successfully",
        questionRemoved: "Question removed successfully",
        editPoints: "Edit points"
    },
    pt: {
        title: "Configuração do Desafio",
        back: "Voltar ao painel",
        saveConfig: "Salvar configuração geral do desafio",
        configSaved: "Configuração salva com sucesso no servidor",
        contestName: "Nome do Concurso",
        startDate: "Data de Início",
        endDate: "Data de Término",
        executionTime: "Tempo de Execução (minutos)",
        welcomeMessageTeacher: "Mensagem de Boas-vindas - Professores",
        welcomeMessageStudent: "Mensagem de Boas-vindas - Estudantes",
        selectLevel: "Selecionar Nível Bebras",
        questionsForLevel: "Questões para o nível",
        noQuestions: "Nenhuma questão adicionada para este nível",
        addQuestion: "Adicionar questão do banco",
        questionBank: "Banco de Questões",
        points: "pts",
        answer: "Resposta correta",
        editQuestion: "Editar questão",
        deleteQuestion: "Excluir questão",
        selectFirst: "Selecione um nível para visualizar as questões",
        alreadyAdded: "Esta questão já foi adicionada a este nível",
        noMoreQuestions: "Não há mais questões disponíveis no banco para este nível",
        close: "Fechar",
        scoringScheme: "Esquema de Pontuação",
        basePoints: "Pontos por resposta correta",
        timeBonus: "Bônus por tempo restante",
        negativePoints: "Penalidade por resposta incorreta",
        levelConfiguration: "Configuração do Nível",
        saveLevelConfig: "Salvar configuração do nível",
        levelConfigSaved: "Configuração salva para",
        pointsConfig: "Configuração de pontos",
        studentWelcome: "Boas-vindas ao estudante",
        generalInfo: "Informações Gerais",
        bebrasCategory: "Categoria Bebras",
        saveFirst: "Voce deve salvar as configuraçoes gerais do desafio no painel esquerdo antes de atribuir preguntas",
        timeInMinutes: "Tempo em minutos para esta categoria",
        errorEmptyTime: "❌ Você deve configurar o tempo de execução para a categoria antes de salvar. O tempo não pode estar vazio ou ser 0.",
        questionAdded: "Questão adicionada com sucesso",
        questionRemoved: "Questão removida com sucesso",
        editPoints: "Editar pontos"
    },
    fr: {
        title: "Configuration du Défi",
        back: "Retour au panneau",
        saveConfig: "Enregistrer la configuration générale du défi",
        configSaved: "Configuration enregistrée avec succès sur le serveur",
        contestName: "Nom du Concours",
        startDate: "Date de Début",
        endDate: "Date de Fin",
        executionTime: "Temps d'Exécution (minutes)",
        welcomeMessageTeacher: "Message de Bienvenue - Enseignants",
        welcomeMessageStudent: "Message de Bienvenue - Étudiants",
        selectLevel: "Sélectionner le Niveau Bebras",
        questionsForLevel: "Questions pour le niveau",
        noQuestions: "Aucune question ajoutée pour ce niveau",
        addQuestion: "Ajouter une question de la banque",
        questionBank: "Banque de Questions",
        points: "pts",
        answer: "Réponse correcte",
        editQuestion: "Modifier la question",
        deleteQuestion: "Supprimer la question",
        selectFirst: "Sélectionnez un niveau pour voir les questions",
        alreadyAdded: "Cette question a déjà été ajoutée à ce niveau",
        noMoreQuestions: "Plus de questions disponibles dans la banque pour ce niveau",
        close: "Fermer",
        scoringScheme: "Barème des Points",
        basePoints: "Points par réponse correcte",
        timeBonus: "Bonus pour le temps restant",
        negativePoints: "Pénalité pour réponse incorrecte",
        levelConfiguration: "Configuration du Niveau",
        saveLevelConfig: "Enregistrer la configuration du niveau",
        levelConfigSaved: "Configuration enregistrée pour",
        pointsConfig: "Configuration des points",
        studentWelcome: "Bienvenue à l'étudiant",
        generalInfo: "Informations Générales",
        bebrasCategory: "Catégorie Bebras",
        saveFirst: "Vous devez enregister les parametres généraux du défi dans le panneau de gauche avant d'attribuer des questions",
        timeInMinutes: "Temps en minutes pour cette catégorie",
        errorEmptyTime: "❌ Vous devez configurer le temps d'exécution pour la catégorie avant d'enregistrer. Le temps ne peut pas être vide ou égal à 0.",
        questionAdded: "Question ajoutée avec succès",
        questionRemoved: "Question supprimée avec succès",
        editPoints: "Modifier les points"
    }
};

const niveles = ['Super Peque', 'Peque', 'Benjamin', 'Cadete', 'Junior', 'Senior'];

// Mapeo de nombres de niveles a IDs
const levelNameToId = {
    'Super Peque': 1,
    'Peque': 2,
    'Benjamin': 3,
    'Cadete': 4,
    'Junior': 5,
    'Senior': 6
};

const Confeccionar_Desafio = ({ onBack, language, onLanguageChange, countryCode = 'CU' }) => {
    const t = translations[language] || translations.es;

    const [config, setConfig] = useState({
        id: Date.now(),
        contestName: 'Desafío Bebras Cuba 2026',
        startDate: '2026-11-01',
        endDate: '2026-11-30',
        executionTime: 45,
        welcomeMessageTeacher: 'Bienvenidos al Desafío Bebras Cuba 2026. Aquí podrán gestionar sus grupos y estudiantes.',
        welcomeMessageStudent: '¡Bienvenido al Desafío Bebras! Lee cada pregunta cuidadosamente y selecciona la respuesta correcta.'
    });

    const [levelConfigs, setLevelConfigs] = useState({});
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [selectedLevel, setSelectedLevel] = useState('');
    const [showQuestionBank, setShowQuestionBank] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editPointsValue, setEditPointsValue] = useState(0);

    // Estados para el banco de preguntas
    const [allTasks, setAllTasks] = useState([]);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('questions');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar configuraciones guardadas
    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        if (savedConfig) setConfig(JSON.parse(savedConfig));

        const savedLevelConfigs = localStorage.getItem('bebrasLevelConfigs');
        if (savedLevelConfigs) setLevelConfigs(JSON.parse(savedLevelConfigs));

        const savedQuestions = localStorage.getItem('bebrasSelectedQuestions');
        if (savedQuestions) setSelectedQuestions(JSON.parse(savedQuestions));
    }, []);

    const trimString = (str) => {
        return str ? String(str).trim() : '';
    };

    const getCategoryIdByLevelName = (levelName) => {
        const categoryMap = {
            1: 'Super-Peque',
            2: 'Peque',
            3: 'Benjamin',
            4: 'Cadete',
            5: 'Junior',
            6: 'Senior'
        };
        const normalizedName = levelName.replace(' ', '-');
        return Object.keys(categoryMap).find(key => categoryMap[key] === normalizedName) ? parseInt(Object.keys(categoryMap).find(key => categoryMap[key] === normalizedName)) : null;
    };

    const getLevelConfig = (level) => {
        return levelConfigs[level] || {
            startDate: config.startDate,
            endDate: config.endDate,
            executionTime: config.executionTime,
            welcomeMessageStudent: config.welcomeMessageStudent,
            scoringScheme: { basePoints: 10, timeBonus: false, negativePoints: 0 }
        };
    };

    // Función para cargar todas las tareas del JSON
    const loadAllTasks = useCallback(async () => {
        try {
            const jsonResponse = await fetch('/tasks.json');
            if (!jsonResponse.ok) {
                throw new Error("No se pudo cargar /tasks.json");
            }
            const data = await jsonResponse.json();
            const rawTasks = data.tasks || [];
            setAllTasks(rawTasks);
            return rawTasks;
        } catch (err) {
            console.error("Error al cargar tasks.json:", err);
            toast.error("Error al cargar el archivo JSON de tareas.");
            return [];
        }
    }, []);

    // Función para filtrar tareas disponibles
    const filterAvailableTasks = useCallback((tasks, level, questions) => {
        if (!level) return [];

        const normalizedCategoryName = level.replace(' ', '-');
        const existingQuestions = questions[level] || [];

        // Extraer todos los identificadores de las preguntas ya agregadas
        const existingTaskCodes = existingQuestions.map(q => trimString(q.task_code || q.taskCode || q.code));
        const existingIds = existingQuestions.map(q => q.originalId || q.id);

        const filtered = tasks.filter(task => {
            const matchesCategory = task.category === level || task.category === normalizedCategoryName;
            const taskCode = trimString(task.taskCode || task.code);
            const isAdded = existingTaskCodes.includes(taskCode) || existingIds.includes(task.id);
            return matchesCategory && !isAdded;
        });

        return filtered;
    }, []);

    // Sincronizar con el servidor
    useEffect(() => {
        const fetchSavedQuestionsFromDB = async () => {
            if (String(config.id).length > 7 || !selectedLevel) return;

            try {
                setIsLoading(true);
                const response = await api.get('/contest_tasks');
                const serverTasks = response.data || [];

                const currentCategoryId = getCategoryIdByLevelName(selectedLevel);
                const filteredServerTasks = serverTasks.filter(
                    t => t.contest_id === config.id && t.category_id === currentCategoryId
                );

                // Cargar tareas del JSON si no están cargadas
                let tasks = allTasks;
                if (tasks.length === 0) {
                    tasks = await loadAllTasks();
                }

                const levelConfig = getLevelConfig(selectedLevel);
                const defaultPoints = levelConfig.scoringScheme?.basePoints || 10;

                const matchingQuestions = filteredServerTasks.map(serverTask => {
                    const taskDetails = tasks.find(
                        r => trimString(r.taskCode) === trimString(serverTask.task_code)
                    ) || {};

                    return {
                        ...taskDetails,
                        id: serverTask.id || Date.now() + Math.random(),
                        originalId: taskDetails.id || serverTask.id,
                        task_code: serverTask.task_code,
                        text: taskDetails.title || taskDetails.question || "Tarea sin título",
                        correctAnswer: taskDetails.correctOption || taskDetails.correctAnswer || "N/A",
                        points: serverTask.points || defaultPoints,
                        display_order: serverTask.display_order
                    };
                });

                setSelectedQuestions(prev => {
                    const updated = {
                        ...prev,
                        [selectedLevel]: matchingQuestions
                    };
                    localStorage.setItem('bebrasSelectedQuestions', JSON.stringify(updated));
                    return updated;
                });

                // Actualizar availableTasks si el modal está abierto
                if (showQuestionBank && tasks.length > 0) {
                    const filtered = filterAvailableTasks(tasks, selectedLevel, { [selectedLevel]: matchingQuestions });
                    setAvailableTasks(filtered);
                }

            } catch (err) {
                console.error("Error al sincronizar preguntas con el servidor Laravel:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedQuestionsFromDB();
    }, [selectedLevel, config.id, showQuestionBank, loadAllTasks, filterAvailableTasks]);

    // Efecto para actualizar availableTasks cuando cambian las preguntas seleccionadas
    useEffect(() => {
        if (showQuestionBank && selectedLevel && allTasks.length > 0) {
            const filtered = filterAvailableTasks(allTasks, selectedLevel, selectedQuestions);
            setAvailableTasks(filtered);
        }
    }, [selectedQuestions, selectedLevel, showQuestionBank, allTasks, filterAvailableTasks]);

    const handleConfigChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleLevelConfigChange = (level, field, value) => {
        setLevelConfigs(prev => ({
            ...prev,
            [level]: { ...prev[level], [field]: value }
        }));
    };

    const saveLevelConfiguration = (level) => {
        const executionTime = levelConfigs[level]?.executionTime;

        if (executionTime === undefined || executionTime === null || executionTime === '' || executionTime <= 0) {
            toast.error(t.errorEmptyTime);
            return;
        }

        localStorage.setItem('bebrasLevelConfigs', JSON.stringify(levelConfigs));

        const levelId = levelNameToId[level];
        if (levelId) {
            localStorage.setItem(`bebrasCategoryTime_${levelId}`, String(executionTime));
        }

        toast.success(`${t.levelConfigSaved} ${level}`);
    };

    const handleOpenQuestionBank = async () => {
        if (!selectedLevel) return;

        if (String(config.id).length > 7) {
            toast.warning("Primero debes guardar la configuración general del desafío (Panel Izquierdo) para registrarlo en la Base de Datos.");
            return;
        }

        try {
            setIsLoading(true);

            // Cargar tareas si no están cargadas
            let tasks = allTasks;
            if (tasks.length === 0) {
                tasks = await loadAllTasks();
            }

            // Filtrar tareas disponibles
            const filtered = filterAvailableTasks(tasks, selectedLevel, selectedQuestions);
            setAvailableTasks(filtered);
            setShowQuestionBank(true);
        } catch (err) {
            console.error("Error al procesar el banco de preguntas:", err);
            toast.error("Error al cargar el banco de preguntas.");
        } finally {
            setIsLoading(false);
        }
    };

    const addQuestionToLevel = async (task) => {
        const existingQuestions = selectedQuestions[selectedLevel] || [];
        const currentTaskCode = task.taskCode || task.task_code || task.code;
        const currentTaskId = task.id;

        // Verificar si la pregunta ya está agregada
        const alreadyAdded = existingQuestions.some(q => {
            const qCode = trimString(q.task_code || q.taskCode || q.code);
            const taskCodeTrimmed = trimString(currentTaskCode);
            return qCode === taskCodeTrimmed || q.originalId === currentTaskId;
        });

        if (alreadyAdded) {
            toast.warning(t.alreadyAdded || 'Esta pregunta ya está agregada');
            return;
        }

        const categoryId = getCategoryIdByLevelName(selectedLevel);
        const displayOrder = existingQuestions.length + 1;

        const contestTaskData = {
            contest_id: config.id,
            category_id: categoryId,
            task_code: currentTaskCode,
            display_order: displayOrder,
            points: task.defaultPoints || 10
        };

        try {
            setIsLoading(true);
            const response = await api.post('/contest_tasks', contestTaskData);

            const serverTaskId = response.data?.id || response.data?.contest_task?.id;

            const levelConfig = getLevelConfig(selectedLevel);
            const points = levelConfig.scoringScheme?.basePoints || task.defaultPoints || 10;

            const taskTitle = task.title || task.question || task.text || "Tarea sin título";
            const correctAnswerDisplay = task.correctOption || task.correctAnswer || "N/A";

            // Crear la nueva pregunta
            const newQuestion = {
                ...task,
                id: serverTaskId || Date.now() + Math.random(),
                originalId: currentTaskId,
                task_code: currentTaskCode,
                text: taskTitle,
                correctAnswer: correctAnswerDisplay,
                points: points,
                display_order: displayOrder,
                server_id: serverTaskId
            };

            // Actualizar las preguntas seleccionadas
            setSelectedQuestions(prev => {
                const currentQuestions = prev[selectedLevel] || [];
                const updated = {
                    ...prev,
                    [selectedLevel]: [...currentQuestions, newQuestion]
                };
                localStorage.setItem('bebrasSelectedQuestions', JSON.stringify(updated));
                return updated;
            });

            // Eliminar la pregunta agregada de availableTasks
            setAvailableTasks(prev => prev.filter(q => {
                const qCode = trimString(q.taskCode || q.code);
                return qCode !== trimString(currentTaskCode) && q.id !== currentTaskId;
            }));

            toast.success(t.questionAdded || 'Pregunta agregada exitosamente');
        } catch (err) {
            console.error("Error en el POST hacia Laravel:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Error al agregar la pregunta.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeQuestion = async (questionId) => {
        const preguntaAEliminar = selectedQuestions[selectedLevel]?.find(q => q.id === questionId);

        if (!preguntaAEliminar) {
            toast.error("No se encontró la pregunta a eliminar.");
            return;
        }

        const currentTaskCode = preguntaAEliminar.task_code || preguntaAEliminar.taskCode || preguntaAEliminar.code;
        const originalId = preguntaAEliminar.originalId;

        if (!currentTaskCode) {
            toast.error("No se pudo determinar el código de la tarea.");
            return;
        }

        try {
            setIsLoading(true);
            await api.delete('/contest_tasks', {
                data: {
                    contest_id: Number(config.id),
                    task_code: currentTaskCode
                }
            });

            // Actualizar las preguntas seleccionadas
            setSelectedQuestions(prev => {
                const updated = {
                    ...prev,
                    [selectedLevel]: prev[selectedLevel].filter(q => q.id !== questionId)
                };
                localStorage.setItem('bebrasSelectedQuestions', JSON.stringify(updated));
                return updated;
            });

            // Restaurar la pregunta en availableTasks
            const taskToAdd = allTasks.find(t => {
                const tCode = trimString(t.taskCode || t.code);
                return tCode === trimString(currentTaskCode) || t.id === originalId;
            });

            if (taskToAdd) {
                const normalizedCategoryName = selectedLevel.replace(' ', '-');
                const matchesCategory = taskToAdd.category === selectedLevel || taskToAdd.category === normalizedCategoryName;

                if (matchesCategory) {
                    setAvailableTasks(prev => {
                        const taskCode = trimString(taskToAdd.taskCode || taskToAdd.code);
                        const alreadyExists = prev.some(t =>
                            trimString(t.taskCode || t.code) === taskCode || t.id === taskToAdd.id
                        );
                        if (alreadyExists) return prev;
                        return [...prev, taskToAdd];
                    });
                }
            }

            toast.success(t.questionRemoved || 'Pregunta eliminada exitosamente');
        } catch (err) {
            console.error("Error al eliminar la pregunta en Laravel:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "No se pudo eliminar la pregunta en el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (question) => {
        setEditingQuestion(question.id);
        setEditPointsValue(question.points);
    };

    const cancelEditing = () => {
        setEditingQuestion(null);
        setEditPointsValue(0);
    };

    const saveEdit = (questionId) => {
        setSelectedQuestions(prev => ({
            ...prev,
            [selectedLevel]: prev[selectedLevel].map(q =>
                q.id === questionId ? {
                    ...q,
                    points: editPointsValue
                } : q
            )
        }));
        setEditingQuestion(null);
        setEditPointsValue(0);
        toast.success('Puntos actualizados');
    };

    const saveConfiguration = async () => {
        setIsSaving(true);
        const year = config.startDate ? new Date(config.startDate).getFullYear() : new Date().getFullYear();

        const datosContest = {
            start_datetime: config.startDate,
            end_datetime: config.endDate,
            year: year,
            country_code: countryCode,
            name: config.contestName,
        };

        try {
            const response = await api.post('/contests', datosContest);
            const serverId = response.data?.id || response.data?.contest?.id;

            if (serverId) {
                const updatedConfig = { ...config, id: serverId, year, countryCode };
                setConfig(updatedConfig);
                localStorage.setItem('bebrasContestConfig', JSON.stringify(updatedConfig));
                toast.success(t.configSaved);
            } else {
                toast.warning("Se guardó el desafío pero no se recibió el ID persistido del backend.");
            }
        } catch (err) {
            console.error('Error al guardar Concurso en Laravel:', err.response?.data?.errors || err.message);
            toast.error("Error crítico al procesar la configuración en Laravel.");
        } finally {
            setIsSaving(false);
        }
    };

    const getTotalScore = () => {
        const questions = selectedQuestions[selectedLevel] || [];
        return questions.reduce((sum, q) => sum + (q.points || 0), 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-slate-600 hover:bg-slate-50 transition-all">
                        <ArrowLeft size={18} /> {t.back}
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800">{t.title}</h1>
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                        {['es', 'en', 'pt', 'fr'].map(lang => (
                            <button key={lang} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === lang ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => onLanguageChange(lang)}>
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Columna Izquierda - Configuración General */}
                    <div className="space-y-6">
                        <button onClick={saveConfiguration} disabled={isSaving || isLoading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all disabled:opacity-50">
                            <Save size={18}/> {isSaving ? 'Guardando...' : t.saveConfig}
                        </button>
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                                <Settings size={20} className="text-blue-600"/> {t.generalInfo}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.contestName}</label>
                                    <input type="text" value={config.contestName} onChange={(e) => handleConfigChange('contestName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t.startDate}</label>
                                        <input type="date" value={config.startDate} onChange={(e) => handleConfigChange('startDate', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t.endDate}</label>
                                        <input type="date" value={config.endDate} onChange={(e) => handleConfigChange('endDate', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.welcomeMessageTeacher}</label>
                                    <textarea value={config.welcomeMessageTeacher} onChange={(e) => handleConfigChange('welcomeMessageTeacher', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Categorías y Banco */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                                <Trophy size={20} className="text-blue-600" /> {t.bebrasCategory}
                            </h2>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.selectLevel}</label>
                                <div className="relative">
                                    <select value={selectedLevel} onChange={(e) => {
                                        setSelectedLevel(e.target.value);
                                        setAvailableTasks([]);
                                        setEditingQuestion(null);
                                    }} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 appearance-none">
                                        <option value="">-- {t.selectLevel} --</option>
                                        {niveles.map(level => <option key={level} value={level}>{level}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {selectedLevel && (
                                <>
                                    <div className="flex gap-2 mb-6 border-b border-slate-200">
                                        <button onClick={() => setActiveTab('config')} className={`px-4 py-2 font-medium ${activeTab === 'config' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>{t.levelConfiguration}</button>
                                        <button onClick={() => setActiveTab('questions')} className={`px-4 py-2 font-medium ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>{t.questionsForLevel}</button>
                                    </div>

                                    {activeTab === 'config' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                                    <Clock size={14} /> {t.executionTime}
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Ej: 30"
                                                    value={getLevelConfig(selectedLevel).executionTime || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '') {
                                                            handleLevelConfigChange(selectedLevel, 'executionTime', '');
                                                        } else {
                                                            const numValue = parseInt(value);
                                                            if (!isNaN(numValue) && numValue > 0) {
                                                                handleLevelConfigChange(selectedLevel, 'executionTime', numValue);
                                                            }
                                                        }
                                                    }}
                                                    className={`w-full px-3 py-2 rounded-lg border ${!getLevelConfig(selectedLevel).executionTime ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} outline-none focus:ring-2 focus:ring-blue-400`}
                                                />
                                                {!getLevelConfig(selectedLevel).executionTime && (
                                                    <p className="text-xs text-red-500 mt-1">⚠️ El tiempo es obligatorio</p>
                                                )}
                                                <p className="text-xs text-slate-400 mt-1">{t.timeInMinutes}</p>
                                            </div>
                                            <button
                                                onClick={() => saveLevelConfiguration(selectedLevel)}
                                                disabled={isLoading}
                                                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                                            >
                                                <Save size={16} /> {t.saveLevelConfig}
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'questions' && (
                                        <>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-slate-800">{t.questionsForLevel}: <span className="text-blue-600">{selectedLevel}</span></h3>
                                                <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">Total: {getTotalScore()} {t.points}</span>
                                            </div>

                                            {isLoading ? (
                                                <div className="text-center py-8">
                                                    <p className="text-slate-500">Cargando preguntas...</p>
                                                </div>
                                            ) : selectedQuestions[selectedLevel]?.length > 0 ? (
                                                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                                    {selectedQuestions[selectedLevel].map((q, idx) => (
                                                        <div key={q.id || idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                                                            {editingQuestion === q.id ? (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-slate-800 font-medium flex-1">{q.text}</p>
                                                                    </div>
                                                                    <div className="flex gap-2 flex-wrap items-end">
                                                                        <div className="flex-1 min-w-[80px]">
                                                                            <label className="text-xs text-slate-500">{t.points}</label>
                                                                            <input
                                                                                type="number"
                                                                                value={editPointsValue || 0}
                                                                                onChange={(e) => setEditPointsValue(parseInt(e.target.value) || 0)}
                                                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                                                                min="0"
                                                                            />
                                                                        </div>
                                                                        <div className="flex gap-1">
                                                                            <button onClick={() => saveEdit(q.id)} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Guardar</button>
                                                                            <button onClick={cancelEditing} className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancelar</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                            <span className="text-sm font-medium text-slate-500">#{idx + 1}</span>
                                                                            <button
                                                                                onClick={() => startEditing(q)}
                                                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-200 flex items-center gap-1"
                                                                            >
                                                                                <Edit3 size={10} /> {q.points} {t.points}
                                                                            </button>
                                                                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">Código: {q.task_code || q.taskCode}</span>
                                                                        </div>
                                                                        <p className="text-slate-800 font-medium">{q.text}</p>
                                                                        <p className="text-xs text-slate-500 mt-1">{t.answer}: {q.correctAnswer}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeQuestion(q.id)}
                                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 bg-slate-50 rounded-xl mb-4">
                                                    <p className="text-slate-400 text-sm">{t.noQuestions}</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleOpenQuestionBank}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-medium hover:bg-blue-50 transition-all disabled:opacity-50"
                                            >
                                                <Plus size={18} /> {t.addQuestion}
                                            </button>

                                            {String(config.id).length > 7 && (
                                                <p className="text-xs text-amber-600 font-semibold mt-2 text-center bg-amber-50 py-1.5 rounded-lg border border-amber-200">
                                                    Configuración guardada en el servidor
                                                </p>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {!selectedLevel && (
                                <div className="text-center py-12 bg-slate-50 rounded-xl">
                                    <Users size={48} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-400">{t.selectFirst}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Banco de Preguntas */}
            {showQuestionBank && selectedLevel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen size={20} className="text-blue-600" /> {t.questionBank} - {selectedLevel}
                            </h3>
                            <button onClick={() => setShowQuestionBank(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={20} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-500">Cargando preguntas disponibles...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {availableTasks.length > 0 ? (
                                        availableTasks.map(question => {
                                            const levelConfig = getLevelConfig(selectedLevel);
                                            const defaultPoints = levelConfig.scoringScheme?.basePoints || 10;
                                            return (
                                                <div key={question.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-800">{question.title || question.question}</p>
                                                        <div className="flex gap-3 mt-1 flex-wrap">
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{defaultPoints} {t.points}</span>
                                                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">Código: {question.taskCode}</span>
                                                            <span className="text-xs text-slate-500">Dificultad: {question.difficulty}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => addQuestionToLevel(question)}
                                                        disabled={isLoading}
                                                        className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-slate-500">{t.noMoreQuestions}</p>
                                            <button
                                                onClick={() => setShowQuestionBank(false)}
                                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {t.close}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Confeccionar_Desafio;