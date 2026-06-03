import React, { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Users, School, UserPlus, Award, BarChart3, Download } from 'lucide-react';
import { toast } from 'sonner';

const translations = {
    es: {
        title: "Reportes y Estadísticas",
        back: "Volver",
        teachers: "Profesores",
        students: "Estudiantes",
        activeGroups: "Grupos Activos",
        pendingActivation: "Pendientes",
        resolved: "Estudiantes que resolvieron",
        completionRate: "Tasa de Finalización",
        avgScore: "Puntuación Promedio",
        exportReport: "Exportar Reporte",
        scoreByLevel: "Puntuación por Nivel",
        points: "pts",
        noData: "No hay datos disponibles"
    },
    en: {
        title: "Reports & Statistics",
        back: "Back",
        teachers: "Teachers",
        students: "Students",
        activeGroups: "Active Groups",
        pendingActivation: "Pending",
        resolved: "Students who completed",
        completionRate: "Completion Rate",
        avgScore: "Average Score",
        exportReport: "Export Report",
        scoreByLevel: "Score by Level",
        points: "pts",
        noData: "No data available"
    },
    pt: {
        title: "Relatórios e Estatísticas",
        back: "Voltar",
        teachers: "Professores",
        students: "Estudantes",
        activeGroups: "Grupos Ativos",
        pendingActivation: "Pendentes",
        resolved: "Estudantes que resolveram",
        completionRate: "Taxa de Conclusão",
        avgScore: "Pontuação Média",
        exportReport: "Exportar Relatório",
        scoreByLevel: "Pontuação por Nível",
        points: "pts",
        noData: "Nenhum dado disponível"
    },
    fr: {
        title: "Rapports et Statistiques",
        back: "Retour",
        teachers: "Enseignants",
        students: "Étudiants",
        activeGroups: "Groupes Actifs",
        pendingActivation: "En attente",
        resolved: "Étudiants ayant résolu",
        completionRate: "Taux d'achèvement",
        avgScore: "Score Moyen",
        exportReport: "Exporter le rapport",
        scoreByLevel: "Score par Niveau",
        points: "pts",
        noData: "Aucune donnée disponible"
    }
};

const Reportes_Estadisticas = ({ onBack, language, onLanguageChange }) => {
    const t = translations[language];

    const [stats, setStats] = useState({
        teachers: 0,
        students: 0,
        activeGroups: 0,
        pendingActivation: 0,
        studentsResolved: 0,
        completionRate: 0,
        avgScore: 0
    });
    const [scoresByLevel, setScoresByLevel] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Cuando el backend esté listo:
                // const response = await fetch('/api/contest-stats');
                // const data = await response.json();
                // setStats(data.stats);
                // setScoresByLevel(data.scoresByLevel);

                // Por ahora datos vacíos
                setStats({
                    teachers: 0,
                    students: 0,
                    activeGroups: 0,
                    pendingActivation: 0,
                    studentsResolved: 0,
                    completionRate: 0,
                    avgScore: 0
                });
                setScoresByLevel({});
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const exportReport = () => {
        const reportData = {
            fecha: new Date().toISOString(),
            estadisticas: stats,
            puntuacionesPorNivel: scoresByLevel
        };
        const dataStr = JSON.stringify(reportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_bebras_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Reporte exportado exitosamente');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-slate-200 rounded w-32"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-32 bg-slate-200 rounded-2xl"></div>
                            <div className="h-32 bg-slate-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header con botón de volver, título y selector de idioma */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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

                    <div className="w-24"></div> {/* Spacer para mantener simetría opcional */}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Columna izquierda - Tarjetas */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                                <GraduationCap size={28} className="mb-2 opacity-80" />
                                <p className="text-3xl font-bold">{stats.teachers}</p>
                                <p className="text-sm opacity-90">{t.teachers}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
                                <Users size={28} className="mb-2 opacity-80" />
                                <p className="text-3xl font-bold">{stats.students}</p>
                                <p className="text-sm opacity-90">{t.students}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg">
                                <School size={28} className="mb-2 opacity-80" />
                                <p className="text-3xl font-bold">{stats.activeGroups}</p>
                                <p className="text-sm opacity-90">{t.activeGroups}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                                <UserPlus size={28} className="mb-2 opacity-80" />
                                <p className="text-3xl font-bold">{stats.pendingActivation}</p>
                                <p className="text-sm opacity-90">{t.pendingActivation}</p>
                            </div>
                        </div>

                        {/* Resumen de puntuaciones por nivel */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <BarChart3 size={20} className="text-blue-600" />
                                {t.scoreByLevel}
                            </h3>
                            {Object.keys(scoresByLevel).length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-8">{t.noData}</p>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(scoresByLevel).map(([level, total]) => (
                                        <div key={level} className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">{level}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-slate-200 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{total} {t.points}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna derecha - Resolución */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Award size={20} className="text-blue-600" />
                                {t.resolved}: {stats.studentsResolved}
                            </h3>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-slate-500">{t.completionRate}</span>
                                <span className="text-2xl font-bold text-emerald-600">{stats.completionRate}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-slate-500">{t.avgScore}</span>
                                <span className="text-2xl font-bold text-blue-600">{stats.avgScore} / 100</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.avgScore}%` }}></div>
                            </div>

                            <button
                                onClick={exportReport}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
                            >
                                <Download size={18} />
                                {t.exportReport}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reportes_Estadisticas;