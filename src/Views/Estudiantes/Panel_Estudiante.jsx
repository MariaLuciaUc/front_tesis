import React, { useState, useEffect } from 'react';
import Desafio_Estudiantes from './Desafio_Estudiantes';
import { LogOut, BookOpen, ChevronRight, Trophy, Star, Clock } from 'lucide-react';
import { useMockAuth } from '../../hooks/useMockAuth';

const translations = {
    es: {
        logout: "Salir",
        welcome: "¡Bienvenido al Desafío Bebras!",
        success: "¡Muchos Éxitos!",
        categoriesTitle: "Desafíos Bebras",
        timePerCategory: "Tiempo asignado",
        yourCategory: "Tu categoría",
        startChallenge: "Comenzar Desafío"
    },
    en: {
        logout: "Logout",
        welcome: "Welcome to the Bebras Challenge!",
        success: "Good luck!",
        categoriesTitle: "Bebras Challenges",
        timePerCategory: "Time assigned",
        yourCategory: "Your category",
        startChallenge: "Start Challenge"
    },
    pt: {
        logout: "Sair",
        welcome: "Bem-vindo ao Desafio Bebras!",
        success: "Boa sorte!",
        categoriesTitle: "Categorias Bebras",
        timePerCategory: "Tempo designado",
        yourCategory: "Sua categoria",
        startChallenge: "Iniciar Desafio"
    },
    fr: {
        logout: "Déconnexion",
        welcome: "Bienvenue au Défi Bebras !",
        success: "Bonne chance !",
        categoriesTitle: "Catégories Bebras",
        timePerCategory: "Temps alloué",
        yourCategory: "Votre catégorie",
        startChallenge: "Commencer le Défi"
    }
};

const Panel_Estudiante = ({ onLogout }) => {
    const { user, isStudent } = useMockAuth();

    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('bebrasLanguage') || 'es';
    });

    const t = translations[language] || translations.es;
    const [view, setView] = useState('panel');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [contestConfig, setContestConfig] = useState(null);
    const [categoryTimes, setCategoryTimes] = useState({});
    const [categoryWelcomeMessages, setCategoryWelcomeMessages] = useState({});

    const categories = [
        { id: 1, name: "Super Peque (1ro y 2do)" },
        { id: 2, name: "Peque (3ro y 4to)" },
        { id: 3, name: "Benjamin (5to y 6to)" },
        { id: 4, name: "Cadete (7mo y 8vo)" },
        { id: 5, name: "Junior (9no y 10mo)" },
        { id: 6, name: "Senior (11no y 12mo)" }
    ];

    const levelNameToId = {
        'Super Peque': 1,
        'Peque': 2,
        'Benjamin': 3,
        'Cadete': 4,
        'Junior': 5,
        'Senior': 6
    };

    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        if (savedConfig) {
            setContestConfig(JSON.parse(savedConfig));
        } else {
            setContestConfig({
                id: 1,
                contestName: 'Desafío Bebras Cuba 2026',
                executionTime: 45,
                welcomeMessageStudent: '¡Bienvenido al Desafío Bebras! Lee cada pregunta cuidadosamente y selecciona la respuesta correcta. Pon a prueba tus habilidades de pensamiento computacional.'
            });
        }

        // Cargar tiempos y mensajes por categoría
        const loadCategoryData = () => {
            const times = {};
            const messages = {};

            categories.forEach(cat => {
                // Cargar tiempo
                const storedTime = localStorage.getItem(`bebrasCategoryTime_${cat.id}`);
                if (storedTime) {
                    times[cat.id] = parseInt(storedTime);
                } else {
                    times[cat.id] = savedConfig ? JSON.parse(savedConfig).executionTime : 45;
                }

                // Cargar mensaje de bienvenida por categoría
                const levelConfigs = localStorage.getItem('bebrasLevelConfigs');
                if (levelConfigs) {
                    const configs = JSON.parse(levelConfigs);
                    const levelName = Object.keys(levelNameToId).find(key => levelNameToId[key] === cat.id);
                    if (levelName && configs[levelName]) {
                        messages[cat.id] = configs[levelName].welcomeMessageStudent || '';
                    }
                }
            });

            setCategoryTimes(times);
            setCategoryWelcomeMessages(messages);
        };

        loadCategoryData();

        const handleStorageChange = (e) => {
            if (e.key === 'bebrasLevelConfigs' || e.key === 'bebrasContestConfig') {
                const savedConfig = localStorage.getItem('bebrasContestConfig');
                const config = savedConfig ? JSON.parse(savedConfig) : { executionTime: 45 };
                const times = {};
                const messages = {};

                categories.forEach(cat => {
                    const storedTime = localStorage.getItem(`bebrasCategoryTime_${cat.id}`);
                    if (storedTime) {
                        times[cat.id] = parseInt(storedTime);
                    } else {
                        times[cat.id] = config.executionTime || 45;
                    }

                    const levelConfigs = localStorage.getItem('bebrasLevelConfigs');
                    if (levelConfigs) {
                        const configs = JSON.parse(levelConfigs);
                        const levelName = Object.keys(levelNameToId).find(key => levelNameToId[key] === cat.id);
                        if (levelName && configs[levelName]) {
                            messages[cat.id] = configs[levelName].welcomeMessageStudent || '';
                        }
                    }
                });

                setCategoryTimes(times);
                setCategoryWelcomeMessages(messages);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Actualizar cuando cambia el idioma
    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        const config = savedConfig ? JSON.parse(savedConfig) : { executionTime: 45 };
        const times = {};
        const messages = {};

        categories.forEach(cat => {
            const storedTime = localStorage.getItem(`bebrasCategoryTime_${cat.id}`);
            if (storedTime) {
                times[cat.id] = parseInt(storedTime);
            } else {
                times[cat.id] = config.executionTime || 45;
            }

            const levelConfigs = localStorage.getItem('bebrasLevelConfigs');
            if (levelConfigs) {
                const configs = JSON.parse(levelConfigs);
                const levelName = Object.keys(levelNameToId).find(key => levelNameToId[key] === cat.id);
                if (levelName && configs[levelName]) {
                    messages[cat.id] = configs[levelName].welcomeMessageStudent || '';
                }
            }
        });

        setCategoryTimes(times);
        setCategoryWelcomeMessages(messages);
    }, [language]);

    if (!isStudent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-red-600">Acceso Denegado</h2>
                    <p className="text-gray-600 mt-2">No tienes permisos para ver este panel.</p>
                </div>
            </div>
        );
    }

    const student = user;
    const studentCategoryId = student?.category_id;
    const studentCategory = categories.find(c => c.id === studentCategoryId);

    const handleIniciarDesafio = (category) => {
        setSelectedCategory(category);
        setView('desafio');
    };

    const handleVolverAlPanel = () => {
        setView('panel');
        setSelectedCategory(null);
    };

    const handleLanguageChange = (lng) => {
        setLanguage(lng);
        localStorage.setItem('bebrasLanguage', lng);
    };

    if (view === 'desafio' && selectedCategory) {
        const categoryExecutionTime = categoryTimes[selectedCategory.id] || contestConfig?.executionTime || 45;
        return (
            <Desafio_Estudiantes
                studentData={student}
                onBackToPanel={handleVolverAlPanel}
                language={language}
                setLanguage={handleLanguageChange}
                contestConfig={{ ...contestConfig, executionTime: categoryExecutionTime }}
                categoryId={selectedCategory.id}
                categoryName={selectedCategory.name}
            />
        );
    }

    // Obtener el mensaje de bienvenida específico de la categoría del estudiante
    const studentWelcomeMessage = studentCategoryId
        ? categoryWelcomeMessages[studentCategoryId] || contestConfig?.welcomeMessageStudent || '¡Bienvenido al Desafío Bebras!'
        : contestConfig?.welcomeMessageStudent || '¡Bienvenido al Desafío Bebras!';

    return (
        <div className="w-full h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
            <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex flex-shrink-0 justify-between items-center z-10 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs">
                        <Star size={20} className="fill-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            {contestConfig?.contestName || "Desafío Bebras"}
                        </h2>
                        <p className="text-base font-semibold text-slate-700 mt-0.5">
                            Estudiante: {student?.full_name}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                        {['es', 'en', 'pt', 'fr'].map((lng) => (
                            <button
                                key={lng}
                                type="button"
                                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                    language === lng
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                                }`}
                                onClick={() => handleLanguageChange(lng)}
                            >
                                {lng.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-semibold text-sm transition-colors cursor-pointer"
                    >
                        <LogOut size={16} /> {t.logout}
                    </button>
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Columna Izquierda - Categorías */}
                <section className="w-full md:w-1/2 h-1/2 md:h-full bg-white p-6 md:p-10 flex flex-col border-r border-slate-200 overflow-y-auto">
                    <div className="mb-4">
                        <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            <BookOpen size={22} className="text-blue-600" /> {t.categoriesTitle}
                        </h3>
                    </div>

                    <div className="flex-1 space-y-3 pr-1">
                        {studentCategory && (
                            <button
                                onClick={() => handleIniciarDesafio(studentCategory)}
                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50/50 border-2 border-blue-400 hover:border-blue-500 rounded-2xl text-left transition-all shadow-md group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                                        <Trophy size={20} className="text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                            {studentCategory.name}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Clock size={12} className="text-blue-400" />
                                            {t.timePerCategory}: {categoryTimes[studentCategory.id] || contestConfig?.executionTime || 45} min
                                        </span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 group-hover:bg-blue-500 transition-all">
                                    <ChevronRight size={18} className="text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                            </button>
                        )}

                        {!studentCategory && (
                            <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                                <p className="text-red-600 font-medium">
                                    No se encontró una categoría asignada para este estudiante.
                                </p>
                                <p className="text-sm text-red-500 mt-1">
                                    Contacta a tu profesor para asignarte una categoría.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Columna Derecha - Mensaje de Bienvenida */}
                <section className="w-full md:w-1/2 h-1/2 md:h-full bg-linear-to-br from-slate-50 to-blue-50/40 p-6 md:p-12 flex flex-col justify-center items-center overflow-y-auto">
                    <div className="max-w-md text-center animate-[fadeInUp_.4s_ease-out]">
                        <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200/50">
                            <Trophy size={48} className="text-blue-600" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
                            {t.welcome}
                        </h3>
                        {/* Mensaje de bienvenida específico de la categoría */}
                        <p className="text-slate-600 text-base leading-relaxed mb-8 bg-white/70 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/60 shadow-xs text-left md:text-center">
                            {studentWelcomeMessage}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold tracking-wide shadow-md shadow-emerald-500/20 transform hover:scale-102 transition-transform">
                            <span>{t.success}</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Panel_Estudiante;