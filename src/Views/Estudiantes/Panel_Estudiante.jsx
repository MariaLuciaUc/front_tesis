import React, { useState, useEffect } from 'react';
import Desafio_Estudiantes from './Desafio_Estudiantes';
import { LogOut} from 'lucide-react';

const translations = {
    es: {
        logout: "Salir",
        challengeButton: "Desafío BebrasCuba - Nivel Benjamin",
        welcome: "¡Bienvenido al Desafío Bebras!",
        ready: "¿Estás listo para ponerte a prueba?",
        success: "¡Éxitos!"
    },
    en: {
        logout: "Logout",
        challengeButton: "BebrasCuba Challenge - Benjamin Level",
        welcome: "Welcome to the Bebras Challenge!",
        ready: "Are you ready to test yourself?",
        success: "Good luck!"
    },
    pt: {
        logout: "Sair",
        challengeButton: "Desafio BebrasCuba - Nível Benjamin",
        welcome: "Bem-vindo ao Desafio Bebras!",
        ready: "Você está pronto para se testar?",
        success: "Boa sorte!"
    },
    fr: {
        logout: "Déconnexion",
        challengeButton: "Défi BebrasCuba - Niveau Benjamin",
        welcome: "Bienvenue au Défi Bebras !",
        ready: "Êtes-vous prêt à vous mettre à l'épreuve ?",
        success: "Bonne chance !"
    }
};

const Panel_Estudiante = ({ student, onLogout, language = 'es', setLanguage }) => {
    const t = translations[language];
    const [desafioIniciado, setDesafioIniciado] = useState(false);
    const [contestConfig, setContestConfig] = useState(null);

    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        if (savedConfig) {
            setContestConfig(JSON.parse(savedConfig));
        } else {
            setContestConfig({
                contestName: 'Desafío Bebras Cuba 2026',
                executionTime: 45,
                welcomeMessageStudent: '¡Bienvenido al Desafío Bebras! Lee cada pregunta cuidadosamente y selecciona la respuesta correcta.'
            });
        }
    }, []);

    const handleIniciarDesafio = () => setDesafioIniciado(true);

    if (desafioIniciado) {
        return <Desafio_Estudiantes
            studentData={student}
            onBackToPanel={() => setDesafioIniciado(false)}
            language={language}
            setLanguage={setLanguage}
            contestConfig={contestConfig}
        />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('es')}>ES</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('en')}>EN</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('pt')}>PT</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('fr')}>FR</button>
                    </div>
                    <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-all">
                        <LogOut size={16} /> {t.logout}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div>
                        <button
                            onClick={handleIniciarDesafio}
                            className="flex items-left p-5 bg-white hover:bg-orange-100 transition-colors border border-gray-200 min-h-[5px] w-full text-left cursor-pointer"
                        >
                            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <p className="text-gray-600 text-l">{contestConfig?.contestName || t.challengeButton}</p>
                        </button>
                    </div>

                    <div className="p-8 bg-white">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.welcome}</h3>
                        <p className="text-gray-600 mb-6">{contestConfig?.welcomeMessageStudent || t.ready}</p>
                        <div className="text-center"><p className="text-xl font-semibold text-gray-800">{t.success}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Panel_Estudiante;