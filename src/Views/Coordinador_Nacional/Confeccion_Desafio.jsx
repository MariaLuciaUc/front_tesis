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
    ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

const translations = {
    es: {
        title: "Confección del Desafío",
        back: "Volver al panel",
        saveConfig: "Guardar Configuración",
        configSaved: "Configuración guardada",
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
        close: "Cerrar"
    },
    en: {
        title: "Challenge Configuration",
        back: "Back to panel",
        saveConfig: "Save Configuration",
        configSaved: "Configuration saved",
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
        close: "Close"
    },
    pt: {
        title: "Configuração do Desafio",
        back: "Voltar ao painel",
        saveConfig: "Salvar Configuração",
        configSaved: "Configuração salva",
        contestName: "Nome do Concurso",
        startDate: "Data de Início",
        endDate: "Data de Término",
        executionTime: "Tempo de Execução (minutos)",
        welcomeMessageTeacher: "Mensagem de Boas-Vindas - Professores",
        welcomeMessageStudent: "Mensagem de Boas-Vindas - Estudantes",
        selectLevel: "Selecionar Nível Bebras",
        questionsForLevel: "Perguntas para o nível",
        noQuestions: "Nenhuma pergunta adicionada para este nível",
        addQuestion: "Adicionar pergunta do banco",
        questionBank: "Banco de Perguntas",
        points: "pts",
        answer: "Resposta correta",
        editQuestion: "Editar pergunta",
        deleteQuestion: "Excluir pergunta",
        selectFirst: "Selecione um nível para ver as perguntas",
        alreadyAdded: "Esta pergunta já foi adicionada a este nível",
        noMoreQuestions: "Não há mais perguntas disponíveis no banco para este nível",
        close: "Fechar"
    },
    fr: {
        title: "Configuration du Défi",
        back: "Retour au tableau",
        saveConfig: "Enregistrer la configuration",
        configSaved: "Configuration enregistrée",
        contestName: "Nom du Concours",
        startDate: "Date de début",
        endDate: "Date de fin",
        executionTime: "Temps d'exécution (minutes)",
        welcomeMessageTeacher: "Message de bienvenue - Enseignants",
        welcomeMessageStudent: "Message de bienvenue - Élèves",
        selectLevel: "Sélectionner le niveau Bebras",
        questionsForLevel: "Questions pour le niveau",
        noQuestions: "Aucune question ajoutée pour ce niveau",
        addQuestion: "Ajouter une question depuis la banque",
        questionBank: "Banque de questions",
        points: "pts",
        answer: "Bonne réponse",
        editQuestion: "Modifier la question",
        deleteQuestion: "Supprimer la question",
        selectFirst: "Sélectionnez un niveau pour voir les questions",
        alreadyAdded: "Cette question a déjà été ajoutée à ce niveau",
        noMoreQuestions: "Il n'y a plus de questions disponibles dans la banque pour ce niveau",
        close: "Fermer"
    }
};

// Banco de preguntas por nivel
const questionBank = {
    'Super Peque': [
        { id: 1, text: '¿Cuál de las siguientes opciones es un animal?', points: 5, correctAnswer: 'Perro' },
        { id: 2, text: '¿Qué forma tiene una pelota?', points: 5, correctAnswer: 'Redonda' },
        { id: 3, text: '¿Cuántas patas tiene un perro?', points: 10, correctAnswer: '4' },
        { id: 4, text: '¿Qué color es el cielo en un día despejado?', points: 5, correctAnswer: 'Azul' }
    ],
    'Peque': [
        { id: 5, text: '¿Cuál es el resultado de 5 + 3?', points: 5, correctAnswer: '8' },
        { id: 6, text: '¿Qué instrumento se usa para medir el tiempo?', points: 5, correctAnswer: 'Reloj' },
        { id: 7, text: '¿Cuántos días tiene una semana?', points: 5, correctAnswer: '7' }
    ],
    'Benjamin': [
        { id: 8, text: '¿Qué comando se usa para repetir una acción en programación?', points: 10, correctAnswer: 'Bucle' },
        { id: 9, text: '¿Qué significa CPU?', points: 10, correctAnswer: 'Unidad Central de Procesamiento' }
    ],
    'Cadete': [
        { id: 10, text: '¿Qué estructura de datos utiliza el principio LIFO?', points: 15, correctAnswer: 'Pila' },
        { id: 11, text: '¿Qué es un algoritmo?', points: 15, correctAnswer: 'Secuencia de pasos para resolver un problema' }
    ],
    'Junior': [
        { id: 12, text: '¿Qué algoritmo de ordenamiento tiene complejidad O(n log n) en el caso promedio?', points: 20, correctAnswer: 'Merge Sort' },
        { id: 13, text: '¿Qué es una variable en programación?', points: 15, correctAnswer: 'Espacio en memoria para almacenar datos' }
    ],
    'Senior': [
        { id: 14, text: '¿Qué técnica de programación resuelve problemas dividiéndolos en subproblemas más pequeños?', points: 25, correctAnswer: 'Divide y vencerás' },
        { id: 15, text: '¿Qué es un árbol binario de búsqueda?', points: 25, correctAnswer: 'Estructura donde cada nodo tiene hasta dos hijos ordenados' }
    ]
};

const niveles = ['Super Peque', 'Peque', 'Benjamin', 'Cadete', 'Junior', 'Senior'];

const Confeccionar_Desafio = ({ onBack, language, onLanguageChange }) => {
    const t = translations[language];

    const [config, setConfig] = useState({
        contestName: 'Desafío Bebras Cuba 2026',
        startDate: '2026-11-01',
        endDate: '2026-11-30',
        executionTime: 45,
        welcomeMessageTeacher: 'Bienvenidos al Desafío Bebras Cuba 2026. Aquí podrán gestionar sus grupos y estudiantes.',
        welcomeMessageStudent: '¡Bienvenido al Desafío Bebras! Lee cada pregunta cuidadosamente y selecciona la respuesta correcta.'
    });

    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [selectedLevel, setSelectedLevel] = useState('');
    const [showQuestionBank, setShowQuestionBank] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        if (savedConfig) setConfig(JSON.parse(savedConfig));
        const savedQuestions = localStorage.getItem('bebrasSelectedQuestions');
        if (savedQuestions) setSelectedQuestions(JSON.parse(savedQuestions));
    }, []);

    const handleConfigChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const addQuestionToLevel = (question) => {
        const existingQuestions = selectedQuestions[selectedLevel] || [];
        const isAlreadyAdded = existingQuestions.some(q =>
            q.originalId === question.id || q.text === question.text
        );

        if (isAlreadyAdded) {
            toast.error(t.alreadyAdded);
            return;
        }

        setSelectedQuestions(prev => ({
            ...prev,
            [selectedLevel]: [...(prev[selectedLevel] || []), {
                ...question,
                id: Date.now(),
                originalId: question.id
            }]
        }));
        setShowQuestionBank(false);
        toast.success(`Pregunta agregada a ${selectedLevel}`);
    };

    const removeQuestion = (questionId) => {
        setSelectedQuestions(prev => ({
            ...prev,
            [selectedLevel]: prev[selectedLevel].filter(q => q.id !== questionId)
        }));
        toast.success('Pregunta eliminada');
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

    const saveConfiguration = () => {
        localStorage.setItem('bebrasContestConfig', JSON.stringify(config));
        localStorage.setItem('bebrasSelectedQuestions', JSON.stringify(selectedQuestions));
        toast.success(t.configSaved);
    };

    const getTotalScore = () => {
        const questions = selectedQuestions[selectedLevel] || [];
        return questions.reduce((sum, q) => sum + (q.points || 0), 0);
    };

    const getAvailableQuestions = () => {
        if (!selectedLevel) return [];
        const existingQuestions = selectedQuestions[selectedLevel] || [];
        const existingOriginalIds = existingQuestions.map(q => q.originalId);
        return (questionBank[selectedLevel] || []).filter(
            question => !existingOriginalIds.includes(question.id)
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header con botón de volver, título y selector de idioma */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft size={18} />
                        {t.back}
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800">{t.title}</h1>

                    {/* Selector de idioma */}
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                            onClick={() => onLanguageChange('es')}
                        >
                            ES
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                            onClick={() => onLanguageChange('en')}
                        >
                            EN
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                            onClick={() => onLanguageChange('pt')}
                        >
                            PT
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                            onClick={() => onLanguageChange('fr')}
                        >
                            FR
                        </button>
                    </div>

                    <button
                        onClick={saveConfiguration}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
                    >
                        <Save size={18} />
                        {t.saveConfig}
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Configuración General */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                                <Settings size={20} className="text-blue-600" />
                                Configuración General
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.contestName}</label>
                                    <input
                                        type="text"
                                        value={config.contestName}
                                        onChange={(e) => handleConfigChange('contestName', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.executionTime}</label>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-slate-400" />
                                        <input
                                            type="number"
                                            value={config.executionTime}
                                            onChange={(e) => handleConfigChange('executionTime', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t.startDate}</label>
                                        <input
                                            type="date"
                                            value={config.startDate}
                                            onChange={(e) => handleConfigChange('startDate', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t.endDate}</label>
                                        <input
                                            type="date"
                                            value={config.endDate}
                                            onChange={(e) => handleConfigChange('endDate', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.welcomeMessageTeacher}</label>
                                    <textarea
                                        value={config.welcomeMessageTeacher}
                                        onChange={(e) => handleConfigChange('welcomeMessageTeacher', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.welcomeMessageStudent}</label>
                                    <textarea
                                        value={config.welcomeMessageStudent}
                                        onChange={(e) => handleConfigChange('welcomeMessageStudent', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Preguntas por Nivel */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                                <BookOpen size={20} className="text-blue-600" />
                                Selección de Preguntas
                            </h2>

                            {/* Selector de nivel */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.selectLevel}</label>
                                <div className="relative">
                                    <select
                                        value={selectedLevel}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="">-- {t.selectLevel} --</option>
                                        {niveles.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {selectedLevel ? (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-800">
                                            {t.questionsForLevel}: <span className="text-blue-600">{selectedLevel}</span>
                                        </h3>
                                        <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">
                                            Total: {getTotalScore()} {t.points}
                                        </span>
                                    </div>

                                    {selectedQuestions[selectedLevel]?.length > 0 ? (
                                        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                            {selectedQuestions[selectedLevel].map((q, idx) => (
                                                <div key={q.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                                                    {editingQuestion === q.id ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={q.text}
                                                                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="number"
                                                                    value={q.points}
                                                                    onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) })}
                                                                    className="w-24 px-3 py-2 rounded-lg border border-slate-200"
                                                                    placeholder={t.points}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={q.correctAnswer}
                                                                    onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200"
                                                                    placeholder={t.answer}
                                                                />
                                                                <button onClick={() => setEditingQuestion(null)} className="px-3 py-2 bg-green-600 text-white rounded-lg">
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-medium text-slate-500">#{idx + 1}</span>
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{q.points} {t.points}</span>
                                                                </div>
                                                                <p className="text-slate-800">{q.text}</p>
                                                                <p className="text-sm text-slate-500 mt-1">{t.answer}: {q.correctAnswer}</p>
                                                            </div>
                                                            <div className="flex gap-2 ml-4">
                                                                <button onClick={() => removeQuestion(q.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
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
                                        onClick={() => setShowQuestionBank(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-medium hover:bg-blue-50 transition-all"
                                    >
                                        <Plus size={18} />
                                        {t.addQuestion}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-xl">
                                    <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
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
                                <BookOpen size={20} className="text-blue-600" />
                                {t.questionBank} - {selectedLevel}
                            </h3>
                            <button onClick={() => setShowQuestionBank(false)} className="p-2 rounded-full hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-3">
                                {getAvailableQuestions().length > 0 ? (
                                    getAvailableQuestions().map(question => (
                                        <div key={question.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{question.text}</p>
                                                <div className="flex gap-3 mt-1">
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{question.points} {t.points}</span>
                                                    <span className="text-xs text-slate-500">{t.answer}: {question.correctAnswer}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => addQuestionToLevel(question)}
                                                className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">{t.noMoreQuestions}</p>
                                        <button
                                            onClick={() => setShowQuestionBank(false)}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                        >
                                            {t.close}
                                        </button>
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