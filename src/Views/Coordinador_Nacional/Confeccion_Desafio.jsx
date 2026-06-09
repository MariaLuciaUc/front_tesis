import api from '../../api/axios';
import React, { useState, useEffect } from 'react';
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
        bebrasCategory: "Categoría Bebras"
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
        bebrasCategory: "Bebras Category"
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
        bebrasCategory: "Categoria Bebras"
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
        bebrasCategory: "Catégorie Bebras"
    }
};

const niveles = ['Super Peque', 'Peque', 'Benjamin', 'Cadete', 'Junior', 'Senior'];

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

    const [availableTasksFromJSON, setAvailableTasksFromJSON] = useState([]);
    const [activeTab, setActiveTab] = useState('questions');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        if (savedConfig) setConfig(JSON.parse(savedConfig));

        const savedLevelConfigs = localStorage.getItem('bebrasLevelConfigs');
        if (savedLevelConfigs) setLevelConfigs(JSON.parse(savedLevelConfigs));
    }, []);

    useEffect(() => {
        const fetchSavedQuestionsFromDB = async () => {
            if (String(config.id).length > 7 || !selectedLevel) return;

            try {
                const response = await api.get('/contest_tasks');
                const serverTasks = response.data || [];

                const currentCategoryId = getCategoryIdByLevelName(selectedLevel);
                const filteredServerTasks = serverTasks.filter(
                    t => t.contest_id === config.id && t.category_id === currentCategoryId
                );

                const jsonResponse = await fetch('/tasks.json');
                const jsonData = await jsonResponse.json();
                const rawTasks = jsonData.tasks || [];

                const levelConfig = getLevelConfig(selectedLevel);
                const defaultPoints = levelConfig.scoringScheme?.basePoints || 10;

                const matchingQuestions = filteredServerTasks.map(serverTask => {
                    const taskDetails = rawTasks.find(
                        r => trimString(r.taskCode) === trimString(serverTask.task_code)
                    ) || {};

                    return {
                        ...taskDetails,
                        id: serverTask.id || Date.now() + Math.random(),
                        originalId: taskDetails.id,
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

            } catch (err) {
                console.error("Error al sincronizar preguntas con el servidor Laravel:", err);
            }
        };

        fetchSavedQuestionsFromDB();
    }, [selectedLevel, config.id]);

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
        localStorage.setItem('bebrasLevelConfigs', JSON.stringify(levelConfigs));
        toast.success(`${t.levelConfigSaved} ${level}`);
    };

    const handleOpenQuestionBank = async () => {
        if (!selectedLevel) return;

        if (String(config.id).length > 7) {
            toast.warning("Primero debes guardar la configuración general del desafío (Panel Izquierdo) para registrarlo en la Base de Datos.");
            return;
        }

        const normalizedCategoryName = selectedLevel.replace(' ', '-');

        try {
            const jsonResponse = await fetch('/tasks.json');
            if (!jsonResponse.ok) {
                throw new Error("No se pudo mapear la ruta de /tasks.json");
            }
            const data = await jsonResponse.json();

            const rawTasks = data.tasks || [];
            const existingQuestions = selectedQuestions[selectedLevel] || [];
            const existingOriginalIds = existingQuestions.map(q => q.originalId);

            const filteredTasks = rawTasks.filter(task => {
                const matchesCategory = task.category === selectedLevel || task.category === normalizedCategoryName;
                const isNotAdded = !existingOriginalIds.includes(task.id);
                return matchesCategory && isNotAdded;
            });

            setAvailableTasksFromJSON(filteredTasks);
            setShowQuestionBank(true);
        } catch (err) {
            console.error("Error al procesar el banco de preguntas:", err);
            toast.error("Error al cargar el archivo JSON de tareas locales.");
        }
    };

    const addQuestionToLevel = async (task) => {
        const existingQuestions = selectedQuestions[selectedLevel] || [];
        const currentTaskCode = task.taskCode || task.task_code || task.code;
        const currentTaskId = task.id;

        const categoryId = getCategoryIdByLevelName(selectedLevel);
        const displayOrder = existingQuestions.length + 1;

        const contestTaskData = {
            id: currentTaskId,
            contest_id: config.id,
            category_id: categoryId,
            task_code: currentTaskCode,
            display_order: displayOrder
        };

        try {
            await api.post('/contest_tasks', contestTaskData);

            const levelConfig = getLevelConfig(selectedLevel);
            const points = levelConfig.scoringScheme?.basePoints || task.defaultPoints || 10;

            const taskTitle = task.title || task.question || task.text || "Tarea sin título";
            const correctAnswerDisplay = task.correctOption || task.correctAnswer || "N/A";

            setSelectedQuestions(prev => {
                const updated = {
                    ...prev,
                    [selectedLevel]: [...(prev[selectedLevel] || []), {
                        ...task,
                        id: Date.now(),
                        originalId: currentTaskId,
                        task_code: currentTaskCode,
                        text: taskTitle,
                        correctAnswer: correctAnswerDisplay,
                        points: points,
                        display_order: displayOrder
                    }]
                };
                localStorage.setItem('bebrasSelectedQuestions', JSON.stringify(updated));
                return updated;
            });

            setAvailableTasksFromJSON(prev => prev.filter(q => q.id !== currentTaskId));
            setShowQuestionBank(false);
            toast.success(`Pregunta asignada y guardada exitosamente en la Base de Datos.`);
        } catch (err) {
            console.error("Error en el POST hacia Laravel:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Laravel rechazó la asociación de la tarea por datos inválidos.");
        }
    };

    const removeQuestion = async (questionId) => {
        const preguntaAEliminar = selectedQuestions[selectedLevel]?.find(q => q.id === questionId);

        if (!preguntaAEliminar) {
            toast.error("No se encontró la pregunta a eliminar.");
            return;
        }

        const currentTaskCode = preguntaAEliminar.task_code || preguntaAEliminar.taskCode || preguntaAEliminar.code;

        if (!currentTaskCode) {
            toast.error("No se pudo determinar el código de la tarea.");
            return;
        }

        try {
            await api.delete('/contest_tasks', {
                data: {
                    contest_id: Number(config.id),
                    task_code: currentTaskCode
                }
            });

            setSelectedQuestions(prev => {
                const updated = {
                    ...prev,
                    [selectedLevel]: prev[selectedLevel].filter(q => q.id !== questionId)
                };
                localStorage.setItem('bebrasSelectedQuestions', JSON.stringify(updated));
                return updated;
            });

            toast.success('Pregunta eliminada de la Base de Datos correctamente.');
        } catch (err) {
            console.error("Error al eliminar la pregunta en Laravel:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "No se pudo eliminar la pregunta en el servidor.");
        }
    };

    const updateQuestionPoints = (questionId, newPoints) => {
        setSelectedQuestions(prev => ({
            ...prev,
            [selectedLevel]: prev[selectedLevel].map(q =>
                q.id === questionId ? { ...q, points: newPoints } : q
            )
        }));
    };

    const updateQuestion = (questionId, updates) => {
        setSelectedQuestions(prev => ({
            ...prev,
            [selectedLevel]: prev[selectedLevel].map(q =>
                q.id === questionId ? { ...q, ...updates } : q
            )
        }));
        setEditingQuestion(null);
        toast.success('Pregunta actualizada');
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
                        <button onClick={saveConfiguration} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all">
                            <Save size={18}/> {isSaving ? '...' : t.saveConfig}
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
                                    <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 appearance-none">
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
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><Clock size={14} /> {t.executionTime}</label>
                                                <input type="number" value={getLevelConfig(selectedLevel).executionTime} onChange={(e) => handleLevelConfigChange(selectedLevel, 'executionTime', parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50" />
                                            </div>
                                            <button onClick={() => saveLevelConfiguration(selectedLevel)} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl"><Save size={16} /> {t.saveLevelConfig}</button>
                                        </div>
                                    )}

                                    {activeTab === 'questions' && (
                                        <>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-slate-800">{t.questionsForLevel}: <span className="text-blue-600">{selectedLevel}</span></h3>
                                                <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">Total: {getTotalScore()} {t.points}</span>
                                            </div>

                                            {selectedQuestions[selectedLevel]?.length > 0 ? (
                                                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                                    {selectedQuestions[selectedLevel].map((q, idx) => (
                                                        <div key={q.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                                                            {editingQuestion === q.id ? (
                                                                <div className="space-y-2">
                                                                    <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200" />
                                                                    <div className="flex gap-2">
                                                                        <input type="number" value={q.points} onChange={(e) => updateQuestionPoints(q.id, parseInt(e.target.value))} className="w-24 px-3 py-2 rounded-lg border border-slate-200" />
                                                                        <input type="text" value={q.correctAnswer} onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-slate-200" />
                                                                        <button onClick={() => setEditingQuestion(null)} className="px-3 py-2 bg-green-600 text-white rounded-lg">Guardar</button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-sm font-medium text-slate-500">#{idx + 1}</span>
                                                                            <button onClick={() => setEditingQuestion(q.id)} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-200 flex items-center gap-1">
                                                                                <Edit3 size={10} /> {q.points} {t.points}
                                                                            </button>
                                                                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">Código: {q.task_code || q.taskCode}</span>
                                                                        </div>
                                                                        <p className="text-slate-800 font-medium">{q.text}</p>
                                                                        <p className="text-xs text-slate-500 mt-1">{t.answer}: {q.correctAnswer}</p>
                                                                    </div>
                                                                    <button onClick={() => removeQuestion(q.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 bg-slate-50 rounded-xl mb-4"><p className="text-slate-400 text-sm">{t.noQuestions}</p></div>
                                            )}

                                            <button onClick={handleOpenQuestionBank} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-medium hover:bg-blue-50 transition-all">
                                                <Plus size={18} /> {t.addQuestion}
                                            </button>

                                            {String(config.id).length > 7 && (
                                                <p className="text-xs text-amber-600 font-semibold mt-2 text-center bg-amber-50 py-1.5 rounded-lg border border-amber-200">
                                                    ⚠️ Debes guardar el Desafío en el panel izquierdo antes de asignar preguntas.
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
                            <div className="space-y-3">
                                {availableTasksFromJSON.length > 0 ? (
                                    availableTasksFromJSON.map(question => {
                                        const levelConfig = getLevelConfig(selectedLevel);
                                        const defaultPoints = levelConfig.scoringScheme?.basePoints || 10;
                                        return (
                                            <div key={question.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-800">{question.title || question.question}</p>
                                                    <div className="flex gap-3 mt-1 flex-wrap">
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{defaultPoints} {t.points}</span>
                                                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">Código: {question.taskCode}</span>
                                                        <span className="text-xs text-slate-500">Dificultad: {question.difficulty}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => addQuestionToLevel(question)} className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">{t.noMoreQuestions}</p>
                                        <button onClick={() => setShowQuestionBank(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">{t.close}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Confeccionar_Desafio;