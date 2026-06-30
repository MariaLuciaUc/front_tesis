import React, { useState } from 'react';
import { Flag, Lock, RefreshCw, Mail, BarChart3, BookOpen, Globe } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Confeccion_Desafio from './Confeccion_Desafio';
import Reportes_Estadisticas from './Reportes_Estadisticas';
import { useMockAuth } from '../../hooks/useMockAuth';
import api from '../../api/axios.js';


const translations = {
    es: {
        title: "Panel del Coordinador Nacional",
        subtitle: "Administración del Desafío Bebras",
        accessKey: "Clave de Acceso",
        keyDescription: "Clave para activación de cuentas de profesores",
        generateKey: "Generar Clave",
        sendToTeachers: "Enviar por correo",
        keyGenerated: "Clave generada correctamente",
        emailSent: "Correo enviado a los profesores",
        confeccionar: "Confeccionar Desafío",
        reportes: "Ver Reportes",
        categoryText: "Configurar fechas, categorías, preguntas y mensajes del desafío",
        statisticsText: "Ver estadísticas de profesores, estudiantes y resultados del desafío",
        selectCountry: "Seleccionar País",
        languageCountry: "Idioma"
    },
    en: {
        title: "National Coordinator Panel",
        subtitle: "Bebras Challenge Administration",
        accessKey: "Access Key",
        keyDescription: "Key for teacher account activation",
        generateKey: "Generate Key",
        sendToTeachers: "Send email",
        keyGenerated: "Key generated successfully",
        emailSent: "Email sent to teachers",
        confeccionar: "Configure Challenge",
        reportes: "View Reports",
        categoryText: "Configure dates, categories, tasks and challenge messages",
        statisticsText: "View teachers, students and challenges statistics",
        selectCountry: "Select Country",
        languageCountry: "Language"
    },
    pt: {
        title: "Painel do Coordenador Nacional",
        subtitle: "Administração do Desafio Bebras",
        accessKey: "Chave de Acesso",
        keyDescription: "Chave para ativação de contas de professores",
        generateKey: "Gerar Chave",
        sendToTeachers: "Enviar por e-mail",
        keyGenerated: "Chave gerada com sucesso",
        emailSent: "E-mail enviado aos professores",
        confeccionar: "Configurar Desafio",
        reportes: "Ver Relatórios",
        categoryText: "Configurar datas, categorias, perguntas e mensagens do desafio",
        statisticsText: "Ver estatísticas de professores, estudantes e resultados do desafio",
        selectCountry: "Selecionar País",
        languageCountry: "Idioma"
    },
    fr: {
        title: "Tableau du Coordinateur National",
        subtitle: "Administration du Défi Bebras",
        accessKey: "Clé d'accès",
        keyDescription: "Clé pour l'activation des comptes enseignants",
        generateKey: "Générer la clé",
        sendToTeachers: "Envoyer par e-mail",
        keyGenerated: "Clé générée avec succès",
        emailSent: "E-mail envoyé aux enseignants",
        confeccionar: "Configurer le Défi",
        reportes: "Voir les rapports",
        categoryText: "Configurer les dates, catégories, questions et messages du défi",
        statisticsText: "Voir les statistiques des enseignants, étudiants et résultats du défi",
        selectCountry: "Sélectionner un Pays",
        languageCountry: "Langue"
    }
};

const LATAM_COUNTRIES = [
    // América Latina (español)
    { code: 'AR', name: 'Argentina', language: 'es' },
    { code: 'BO', name: 'Bolivia', language: 'es' },
    { code: 'CL', name: 'Chile', language: 'es' },
    { code: 'CO', name: 'Colombia', language: 'es' },
    { code: 'CR', name: 'Costa Rica', language: 'es' },
    { code: 'CU', name: 'Cuba', language: 'es' },
    { code: 'DO', name: 'República Dominicana', language: 'es' },
    { code: 'EC', name: 'Ecuador', language: 'es' },
    { code: 'SV', name: 'El Salvador', language: 'es' },
    { code: 'GT', name: 'Guatemala', language: 'es' },
    { code: 'HN', name: 'Honduras', language: 'es' },
    { code: 'MX', name: 'México', language: 'es' },
    { code: 'NI', name: 'Nicaragua', language: 'es' },
    { code: 'PA', name: 'Panamá', language: 'es' },
    { code: 'PY', name: 'Paraguay', language: 'es' },
    { code: 'PE', name: 'Perú', language: 'es' },
    { code: 'PR', name: 'Puerto Rico', language: 'es' },
    { code: 'UY', name: 'Uruguay', language: 'es' },
    { code: 'VE', name: 'Venezuela', language: 'es' },
    // América Latina (portugués)
    { code: 'BR', name: 'Brasil', language: 'pt' },
    // Caribe (inglés)
    { code: 'AG', name: 'Antigua y Barbuda', language: 'en' },
    { code: 'BS', name: 'Bahamas', language: 'en' },
    { code: 'BB', name: 'Barbados', language: 'en' },
    { code: 'BZ', name: 'Belice', language: 'en' },
    { code: 'DM', name: 'Dominica', language: 'en' },
    { code: 'GD', name: 'Granada', language: 'en' },
    { code: 'GY', name: 'Guyana', language: 'en' },
    { code: 'HT', name: 'Haití', language: 'fr' },
    { code: 'JM', name: 'Jamaica', language: 'en' },
    { code: 'KN', name: 'San Cristóbal y Nieves', language: 'en' },
    { code: 'LC', name: 'Santa Lucía', language: 'en' },
    { code: 'VC', name: 'San Vicente y las Granadinas', language: 'en' },
    { code: 'SR', name: 'Suriname', language: 'en' },
    { code: 'TT', name: 'Trinidad y Tobago', language: 'en' },
    // Caribe (francés)
    { code: 'GF', name: 'Guayana Francesa', language: 'fr' },
    { code: 'GP', name: 'Guadalupe', language: 'fr' },
    { code: 'MQ', name: 'Martinica', language: 'fr' },

];

const Panel_Coordinador_Nacional = ({ onLanguageChange: externalLanguageChange, language: externalLanguage }) => {
    const { user, isCoordinator } = useMockAuth();

    const [language, setLanguage] = useState(externalLanguage || 'es');
    const t = translations[language];
    const [accessKey, setAccessKey] = useState('');
    const [keyGenerated, setKeyGenerated] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showConfeccion, setShowConfeccion] = useState(false);
    const [showReportes, setShowReportes] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('CU');

    const getCountryInfo = (countryCode) => {
        return LATAM_COUNTRIES.find(c => c.code === countryCode) || LATAM_COUNTRIES.find(c => c.code === 'CU');
    };

    const generateAccessKey = () => {
        const fecha = new Date();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anno = fecha.getFullYear();
        const countryInfo = getCountryInfo(selectedCountry);
        const pais = countryInfo.code;
        const key = `BEBRAS${pais}${mes}${anno}`;
        setAccessKey(key);
        setKeyGenerated(true);
        localStorage.setItem('bebrasAccessKey', key);
        localStorage.setItem('bebrasCountry', selectedCountry);
        toast.success('Clave generada correctamente');
    };

    const sendKeyToTeachers = async () => {
        if (!accessKey) {
            toast.warning('Primero genere la clave de acceso');
            return;
        }

        setIsSending(true);
        try {
            const year = new Date().getFullYear();

            const subject = `Clave de acceso para el Desafío Bebras ${year}`;
            const body = `Estimado profesor,\n\nSe ha generado la clave de acceso para el Desafío Bebras ${year}:\n\nCLAVE: ${accessKey}\n\nPor favor, utilice esta clave para activar su cuenta y acceder al panel de profesor.\n\nSaludos,\nCoordinación Nacional Bebras`;

            const response = await api.post('/send-email', {
                subject: subject,
                body: body
            });

            if (response.data.success) {
                const count = response.data.teachers_sent || 0;
                if (count > 0) {
                    toast.success(`Correo enviado exitosamente a ${count} profesores`);
                } else {
                    toast.warning('No hay profesores registrados en la base de datos');
                }
            } else {
                toast.error(response.data.message || 'Error al enviar los correos');
            }
        } catch (error) {
            console.error('Error al enviar correos:', error);
            const errorMsg = error.response?.data?.message || 'Error al enviar los correos';
            toast.error(errorMsg);
        } finally {
            setIsSending(false);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (externalLanguageChange) externalLanguageChange(newLang);
    };

    const handleCountryChange = (countryCode) => {
        setSelectedCountry(countryCode);
        const countryInfo = getCountryInfo(countryCode);
        if (countryInfo) {
            setLanguage(countryInfo.language);
            localStorage.setItem('bebrasCountry', countryCode);
            if (externalLanguageChange) externalLanguageChange(countryInfo.language);
        }
        setKeyGenerated(false);
        setAccessKey('');
    };

    if (!isCoordinator) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-red-600">Acceso Denegado</h2>
                    <p className="text-gray-600 mt-2">No tienes permisos para ver este panel.</p>
                </div>
            </div>
        );
    }

    if (showConfeccion) {
        return <Confeccion_Desafio onBack={() => setShowConfeccion(false)} language={language} onLanguageChange={handleLanguageChange} countryCode={selectedCountry} />;
    }

    if (showReportes) {
        return <Reportes_Estadisticas
            onBack={() => setShowReportes(false)}
            language={language}
            onLanguageChange={handleLanguageChange}
            selectedCountry={selectedCountry}
        />;
    }

    const countryInfo = getCountryInfo(selectedCountry);
    const countryName = countryInfo?.name || 'Cuba';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
            <Toaster position="top-right" richColors />

            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <Flag className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-800">{t.title}</h1>
                                <p className="text-sm text-slate-500">
                                    {t.subtitle} — {user?.name || 'Coordinador Nacional'} ({countryName})
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                <Globe size={16} className="text-slate-500" />
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    className="bg-transparent outline-none text-sm font-medium text-slate-700 cursor-pointer max-w-[140px]"
                                >
                                    {LATAM_COUNTRIES.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                                {['es', 'en', 'pt', 'fr'].map((lng) => (
                                    <button
                                        key={lng}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === lng ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                                        onClick={() => {
                                            setLanguage(lng);
                                            if (externalLanguageChange) externalLanguageChange(lng);
                                        }}
                                    >
                                        {lng.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
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
                        <div className="flex items-center gap-3 flex-wrap">
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

                <div className="grid md:grid-cols-1 gap-6">
                    <button
                        onClick={() => setShowConfeccion(true)}
                        className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all group"
                    >
                        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                            <BookOpen size={32} className="text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{t.confeccionar}</h2>
                        <p className="text-slate-500 text-sm">{t.categoryText}</p>
                    </button>
                </div>
                <div className="grid md:grid-cols-1 gap-6 mb-10 pt-4">
                    <button
                        onClick={() => setShowReportes(true)}
                        className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all group"
                    >
                        <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors">
                            <BarChart3 size={32} className="text-emerald-600 group-hover:text-white transition-colors"/>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{t.reportes}</h2>
                        <p className="text-slate-500 text-sm">{t.statisticsText}</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Panel_Coordinador_Nacional;