import React, { useState } from 'react';
import { User, Lock, LogIn, BookOpen, Shield } from 'lucide-react';
import castorcubasi from '/src/castorcubasi.jpg';
import Panel_Estudiante from './Panel_Estudiante';

const Login_Estudiante = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [studentData, setStudentData] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Ingresa usuario y contraseña');
            return;
        }

        if (username === 'ana' && password === '123') {
            setStudentData({ username, name: 'Ana García', code: username });
            setLoggedIn(true);
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setStudentData(null);
        setUsername('');
        setPassword('');
    };

    if (loggedIn) {
        return <Panel_Estudiante student={studentData} onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-[fadeInUp_.4s_ease-out]">
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img src={castorcubasi} alt="Castor Bebras" className="w-24 h-24 shadow-md" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Bienvenido al Desafío Bebras</h2>
                    <p className="text-slate-500 text-sm mt-2">Ingresa tus credenciales para comenzar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <User size={16} /> Usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Ej: anagarcia"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Lock size={16} /> Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
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
                        <LogIn size={18} /> Ingresar
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <BookOpen size={12} /> Desafío Internacional de Pensamiento Computacional
                    </p>
                    <p className="text-xs text-slate-300 mt-2">Prueba con: ana / 123</p>
                </div>
            </div>
        </div>
    );
};

export default Login_Estudiante;