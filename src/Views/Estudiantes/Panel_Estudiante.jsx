// Panel_Estudiante.jsx
import React, { useState, useEffect } from 'react';
import Desafio_Estudiantes from './Desafio_Estudiantes';
import { LogOut, BookOpen, ChevronRight, Trophy, Star, Clock } from 'lucide-react';

const translations = {
    es: {
        logout: "Salir",
        welcome: "¡Bienvenido al Desafío Bebras!",
        ready: "Selecciona tu categoría para ponerte a prueba:",
        success: "¡Muchos Éxitos!",
        categoriesTitle: "Categorías del Desafío",
        timePerCategory: "Tiempo asignado"
    },
    en: {
        logout: "Logout",
        welcome: "Welcome to the Bebras Challenge!",
        ready: "Select your category to test yourself:",
        success: "Good luck!",
        categoriesTitle: "Challenge Categories",
        timePerCategory: "Time assigned"
    },
    pt: {
        logout: "Sair",
        welcome: "Bem-vindo ao Desafio Bebras!",
        ready: "Selecione sua categoria para se testar:",
        success: "Boa sorte!",
        categoriesTitle: "Categorias do Desafio",
        timePerCategory: "Tempo designado"
    },
    fr: {
        logout: "Déconnexion",
        welcome: "Bienvenue au Défi Bebras !",
        ready: "Sélectionnez votre catégorie pour vous mettre à l'épreuve :",
        success: "Bonne chance !",
        categoriesTitle: "Catégories du Défi",
        timePerCategory: "Temps alloué"
    }
};

// Mapeo de IDs de categoría a nombres
const categoryIdToName = {
    1: 'Super Peque',
    2: 'Peque',
    3: 'Benjamin',
    4: 'Cadete',
    5: 'Junior',
    6: 'Senior'
};

const Panel_Estudiante = ({ student, onLogout }) => {
    // Estado interno para el idioma
    const [language, setLanguage] = useState(() => {
        // Cargar idioma guardado en localStorage o usar 'es' por defecto
        return localStorage.getItem('bebrasLanguage') || 'es';
    });

    const t = translations[language] || translations.es;
    const [view, setView] = useState('panel');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [contestConfig, setContestConfig] = useState(null);
    const [categoryTimes, setCategoryTimes] = useState({});

    const categories = [
        { id: 1, name: "Super Peque (Pre-Escolar a 2do)" },
        { id: 2, name: "Peque (3ro y 4to)" },
        { id: 3, name: "Benjamin (5to y 6to)" },
        { id: 4, name: "Cadete (7mo y 8vo)" },
        { id: 5, name: "Junior (9no y 10mo)" },
        { id: 6, name: "Senior (11no y 12mo)" }
    ];

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

        // Cargar los tiempos por categoría desde localStorage
        const loadCategoryTimes = () => {
            const times = {};
            categories.forEach(cat => {
                const storedTime = localStorage.getItem(`bebrasCategoryTime_${cat.id}`);
                if (storedTime) {
                    times[cat.id] = parseInt(storedTime);
                } else {
                    // Si no hay tiempo específico, usar el tiempo general
                    times[cat.id] = savedConfig ? JSON.parse(savedConfig).executionTime : 45;
                }
            });
            setCategoryTimes(times);
        };

        loadCategoryTimes();

        // Escuchar cambios en localStorage para actualizar tiempos
        const handleStorageChange = (e) => {
            if (e.key === 'bebrasLevelConfigs' || e.key === 'bebrasContestConfig') {
                const savedConfig = localStorage.getItem('bebrasContestConfig');
                const config = savedConfig ? JSON.parse(savedConfig) : { executionTime: 45 };

                const times = {};
                categories.forEach(cat => {
                    const storedTime = localStorage.getItem(`bebrasCategoryTime_${cat.id}`);
                    if (storedTime) {
                        times[cat.id] = parseInt(storedTime);
                    } else {
                        times[cat.id] = config.executionTime || 45;
                    }
                });
                setCategoryTimes(times);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        const config = savedConfig ? JSON.parse(savedConfig) : { executionTime: 45 };

        const times = {};
        categories.forEach(cat => {
            const storedTime = localStorage.getItem(`bebrasCategoryTime_${cat.id}`);
            if (storedTime) {
                times[cat.id] = parseInt(storedTime);
            } else {
                times[cat.id] = config.executionTime || 45;
            }
        });
        setCategoryTimes(times);
    }, [language]);

    const handleIniciarDesafio = (category) => {
        setSelectedCategory(category);
        setView('desafio');
    };

    const handleVolverAlPanel = () => {
        setView('panel');
        setSelectedCategory(null);
    };

    // Función para cambiar idioma con persistencia
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

    return (
        <div className="w-full h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">

            {/* Header Superior Fijo */}
            <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex flex-shrink-0 justify-between items-center z-10 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs">
                        <Star size={20} className="fill-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            {contestConfig?.contestName || "Desafío Bebras"}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Selector de Idiomas mejorado */}
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

                    {/* Botón Salir */}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-semibold text-sm transition-colors cursor-pointer"
                    >
                        <LogOut size={16} /> {t.logout}
                    </button>
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col md:flex-row overflow-hidden">

                <section className="w-full md:w-1/2 h-1/2 md:h-full bg-white p-6 md:p-10 flex flex-col border-r border-slate-200 overflow-y-auto">
                    <div className="mb-4">
                        <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            <BookOpen size={22} className="text-blue-600" /> {t.categoriesTitle}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{t.ready}</p>
                    </div>

                    <div className="flex-1 space-y-3 pr-1">
                        {categories.map((cat) => {
                            const timeForCategory = categoryTimes[cat.id] || contestConfig?.executionTime || 45;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleIniciarDesafio(cat)}
                                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl text-left transition-all shadow-xs group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-base group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:scale-105">
                                            {cat.id}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                                {cat.name}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Clock size={12} className="text-blue-400" />
                                                {t.timePerCategory}: {timeForCategory} min
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-100 transition-all">
                                        <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="w-full md:w-1/2 h-1/2 md:h-full bg-linear-to-br from-slate-50 to-blue-50/40 p-6 md:p-12 flex flex-col justify-center items-center overflow-y-auto">
                    <div className="max-w-md text-center animate-[fadeInUp_.4s_ease-out]">

                        <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200/50">
                            <Trophy size={48} className="text-blue-600" />
                        </div>

                        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
                            {t.welcome}
                        </h3>

                        <p className="text-slate-600 text-base leading-relaxed mb-8 bg-white/70 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/60 shadow-xs text-left md:text-center">
                            {contestConfig?.welcomeMessageStudent || t.ready}
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