// Panel_Coordinador_Nacional.jsx
import React, { useState, useEffect, useRef } from 'react';
import {Flag, Lock, RefreshCw, Mail, BarChart3, BookOpen} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Confeccion_Desafio from './Confeccion_Desafio';
import Reportes_Estadisticas from './Reportes_Estadisticas';

const translations = {
    es: {
        title: "Panel del Coordinador Nacional",
        subtitle: "Administración del Desafío BebrasCuba",
        accessKey: "Clave de Acceso",
        keyDescription: "Clave para activación de cuentas de profesores",
        generateKey: "Generar Clave",
        sendToTeachers: "Enviar por correo",
        keyGenerated: "Clave generada correctamente",
        emailSent: "Correo enviado a los profesores",
        confeccionar: "Confeccionar Desafío",
        reportes: "Ver Reportes"
    },
    en: {
        title: "National Coordinator Panel",
        subtitle: "BebrasCuba Challenge Administration",
        accessKey: "Access Key",
        keyDescription: "Key for teacher account activation",
        generateKey: "Generate Key",
        sendToTeachers: "Send email",
        keyGenerated: "Key generated successfully",
        emailSent: "Email sent to teachers",
        confeccionar: "Configure Challenge",
        reportes: "View Reports"
    }
};

const Panel_Coordinador_Nacional = () => {
    const [language, setLanguage] = useState('es');
    const t = translations[language];
    const [accessKey, setAccessKey] = useState('');
    const [keyGenerated, setKeyGenerated] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showConfeccion, setShowConfeccion] = useState(false);
    const [showReportes, setShowReportes] = useState(false);

    // Generar clave: BEBRAS + CUBA + MES + AÑO
    const generateAccessKey = () => {
        const fecha = new Date();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        const key = `BEBRASCUBA${mes}${año}`;
        setAccessKey(key);
        setKeyGenerated(true);
        localStorage.setItem('bebrasAccessKey', key);
    };

    // Enviar clave por correo a profesores
    const sendKeyToTeachers = async () => {
        if (!accessKey) {
            toast.warning('Primero genere la clave de acceso');
            return;
        }
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
        }, 1000);
    };

    if (showConfeccion) {
        return <Confeccion_Desafio onBack={() => setShowConfeccion(false)} language={language} />;
    }

    if (showReportes) {
        return <Reportes_Estadisticas onBack={() => setShowReportes(false)} language={language} />;
    }

    return (
        <div className="min-h-screen bg-blue-to-br from-slate-100 to-sky-100 font-sans">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <Flag className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-800">{t.title}</h1>
                                <p className="text-sm text-slate-500">{t.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                                onClick={() => setLanguage('es')}
                            >
                                ES
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                                onClick={() => setLanguage('en')}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tarjeta de Clave de Acceso */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Lock size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{t.accessKey}</h3>
                                <p className="text-blue-100 text-sm">{t.keyDescription}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Solo mostrar la clave si ha sido generada */}
                            {keyGenerated && accessKey && (
                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-mono text-xl font-bold tracking-wider">
                                    {accessKey}
                                </div>
                            )}
                            <button
                                onClick={generateAccessKey}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all shadow-lg"
                            >
                                <RefreshCw size={18} />
                                {t.generateKey}
                            </button>
                            <button
                                onClick={sendKeyToTeachers}
                                disabled={isSending || !accessKey}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Mail size={18} />
                                {isSending ? '...' : t.sendToTeachers}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botones de acción principales */}
                <div className="grid md:grid-cols-1 gap-6">
                    <button
                        onClick={() => setShowConfeccion(true)}
                        className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all group"
                    >
                        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                            <BookOpen size={32} className="text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{t.confeccionar}</h2>
                        <p className="text-slate-500 text-sm">
                            Configurar fechas, categorías, preguntas y mensajes del desafío
                        </p>
                    </button>
                </div>
                <div className="grid md:grid-cols-1 gap-6 mb-10">
                    <button
                        onClick={() => setShowReportes(true)}
                        className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all group"
                    >
                        <div
                            className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors">
                            <BarChart3 size={32} className="text-emerald-600 group-hover:text-white transition-colors"/>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{t.reportes}</h2>
                        <p className="text-slate-500 text-sm">
                            Ver estadísticas de profesores, estudiantes y resultados del desafío
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Panel_Coordinador_Nacional;