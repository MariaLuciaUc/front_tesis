import React, { useState } from 'react';
import { User, Lock, LogIn, BookOpen, Shield } from 'lucide-react';
import castorcubasi from '/src/castorcubasi.jpg';
import Panel_Estudiante from './Panel_Estudiante';

const translations = {
    es: {
        welcome: "Bienvenido al Desafío Bebras",
        subtitle: "Ingresa tus credenciales para comenzar",
        username: "Usuario",
        password: "Contraseña",
        usernamePlaceholder: "Ej: anagarcia",
        passwordPlaceholder: "••••••••",
        login: "Ingresar",
        footer: "Desafío Internacional de Pensamiento Computacional",
        errorEmpty: "Ingresa usuario y contraseña",
        errorInvalid: "Usuario o contraseña incorrectos"
    },
    en: {
        welcome: "Welcome to the Bebras Challenge",
        subtitle: "Enter your credentials to start",
        username: "Username",
        password: "Password",
        usernamePlaceholder: "e.g., anagarcia",
        passwordPlaceholder: "••••••••",
        login: "Login",
        footer: "International Computational Thinking Challenge",
        errorEmpty: "Please enter username and password",
        errorInvalid: "Invalid username or password"
    },
    pt: {
        welcome: "Bem-vindo ao Desafio Bebras",
        subtitle: "Insira suas credenciais para começar",
        username: "Usuário",
        password: "Senha",
        usernamePlaceholder: "Ex: anagarcia",
        passwordPlaceholder: "••••••••",
        login: "Entrar",
        footer: "Desafio Internacional de Pensamento Computacional",
        errorEmpty: "Digite usuário e senha",
        errorInvalid: "Usuário ou senha incorretos"
    },
    fr: {
        welcome: "Bienvenue au Défi Bebras",
        subtitle: "Entrez vos identifiants pour commencer",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        usernamePlaceholder: "Ex: anagarcia",
        passwordPlaceholder: "••••••••",
        login: "Se connecter",
        footer: "Défi International de Pensée Computationnelle",
        errorEmpty: "Veuillez saisir un nom d'utilisateur et un mot de passe",
        errorInvalid: "Nom d'utilisateur ou mot de passe incorrect"
    }
};

const Login_Estudiante = () => {
    const [language, setLanguage] = useState('es');
    const t = translations[language];

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [studentData, setStudentData] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError(t.errorEmpty);
            return;
        }

        if (username === 'ana' && password === '123') {
            setStudentData({ username, name: 'Ana García', code: username });
            setLoggedIn(true);
        } else {
            setError(t.errorInvalid);
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setStudentData(null);
        setUsername('');
        setPassword('');
    };

    if (loggedIn) {
        return <Panel_Estudiante student={studentData} onLogout={handleLogout} language={language} setLanguage={setLanguage} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative animate-[fadeInUp_.4s_ease-out]">
                {/* Selector de idioma */}
                <div className="absolute top-4 right-4 flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('es')}>ES</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('en')}>EN</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('pt')}>PT</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('fr')}>FR</button>
                </div>

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img src={castorcubasi} alt="Castor Bebras" className="w-24 h-24 shadow-md" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800">{t.welcome}</h2>
                    <p className="text-slate-500 text-sm mt-2">{t.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <User size={16} /> {t.username}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder={t.usernamePlaceholder}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Lock size={16} /> {t.password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder={t.passwordPlaceholder}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                            <Shield size={16} /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <LogIn size={18} /> {t.login}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
                        <BookOpen size={12} /> {t.footer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login_Estudiante;