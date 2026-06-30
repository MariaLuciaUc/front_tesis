import React, { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Users, Download, FileSpreadsheet, Flag } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import api from '../../api/axios.js';

const translations = {
    es: {
        title: "Reportes y Estadísticas",
        back: "Volver",
        teachers: "Profesores",
        students: "Estudiantes",
        exportReport: "Exportar Reporte",
        country: "País",
        reportGenerated: "Reporte exportado exitosamente",
        loading: "Cargando datos...",
        error: "Error al cargar los datos",
        noData: "No hay datos para exportar"
    },
    en: {
        title: "Reports & Statistics",
        back: "Back",
        teachers: "Teachers",
        students: "Students",
        exportReport: "Export Report",
        country: "Country",
        reportGenerated: "Report exported successfully",
        loading: "Loading data...",
        error: "Error loading data",
        noData: "No data to export"
    },
    pt: {
        title: "Relatórios e Estatísticas",
        back: "Voltar",
        teachers: "Professores",
        students: "Estudantes",
        exportReport: "Exportar Relatório",
        country: "País",
        reportGenerated: "Relatório exportado com sucesso",
        loading: "Carregando dados...",
        error: "Erro ao carregar dados",
        noData: "Sem dados para exportar"
    },
    fr: {
        title: "Rapports et Statistiques",
        back: "Retour",
        teachers: "Enseignants",
        students: "Étudiants",
        exportReport: "Exporter le rapport",
        country: "Pays",
        reportGenerated: "Rapport exporté avec succès",
        loading: "Chargement des données...",
        error: "Erreur de chargement",
        noData: "Aucune donnée à exporter"
    }
};

// Mapeo de niveles
const levelMap = {
    1: 'Super Peque',
    2: 'Peque',
    3: 'Benjamin',
    4: 'Cadete',
    5: 'Junior',
    6: 'Senior'
};

const Reportes_Estadisticas = ({ onBack, language, onLanguageChange, selectedCountry = 'CU' }) => {
    const t = translations[language];

    const [stats, setStats] = useState({
        teachers: 0,
        students: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [studentsByLevel, setStudentsByLevel] = useState({});

    const countryName = 'Cuba';

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log('🔍 INICIANDO FETCH...');

                // 1. Obtener profesores
                console.log('📡 Obteniendo teachers...');
                const teachersRes = await api.get('/teachers');
                const teachers = teachersRes.data || [];
                console.log('✅ Teachers:', teachers.length);

                // 2. Obtener todos los grupos
                console.log('📡 Obteniendo groups...');
                const groupsRes = await api.get('/groups');
                const groups = groupsRes.data || [];
                console.log('✅ Groups:', groups.length);

                // 3. Obtener estudiantes de CADA grupo
                console.log('📡 Obteniendo estudiantes de cada grupo...');
                let allStudents = [];

                for (const group of groups) {
                    try {
                        const studentsRes = await api.get(`/groups/${group.id}/students`);
                        if (studentsRes.data && studentsRes.data.students) {
                            const groupStudents = studentsRes.data.students.map(s => ({
                                ...s,
                                groupName: group.group_name,
                                school: group.school,
                                teacherId: group.teacher_id,
                                categoryId: group.category_id
                            }));
                            allStudents = [...allStudents, ...groupStudents];
                            console.log(`📚 Grupo ${group.group_name} (${levelMap[group.category_id] || 'N/A'}): ${groupStudents.length} estudiantes`);
                        }
                    } catch (err) {
                        console.error(`Error al obtener estudiantes del grupo ${group.id}:`, err);
                    }
                }

                console.log('✅ Total estudiantes:', allStudents.length);

                // 4. Obtener sesiones
                console.log('📡 Obteniendo contest_sessions...');
                const sessionsRes = await api.get('/contest_sessions');
                const sessions = sessionsRes.data || [];
                console.log('✅ Sessions:', sessions.length);

                // --- ESTADÍSTICAS ---
                setStats({
                    teachers: teachers.length,
                    students: allStudents.length
                });

                // --- AGRUPAR ESTUDIANTES POR CATEGORÍA ---
                const groupedByLevel = {};
                allStudents.forEach(student => {
                    const levelId = student.categoryId;
                    const levelName = levelMap[levelId] || `Nivel ${levelId}`;
                    if (!groupedByLevel[levelName]) {
                        groupedByLevel[levelName] = [];
                    }
                    groupedByLevel[levelName].push(student);
                });
                setStudentsByLevel(groupedByLevel);
                console.log('📊 Estudiantes por nivel:', Object.keys(groupedByLevel).map(key => `${key}: ${groupedByLevel[key].length}`));

                // --- PREPARAR DATOS PARA REPORTE EXCEL ---
                const reportData = allStudents.map(student => {
                    const session = sessions.find(s => s.student_id === student.id);
                    const teacher = teachers.find(t => t.id === student.teacherId);

                    let startTime = '';
                    let endTime = '';

                    if (session?.start_time) {
                        try {
                            const date = new Date(session.start_time);
                            startTime = date.toString();
                        } catch (e) {
                            startTime = session.start_time || '';
                        }
                    }

                    if (session?.last_activity) {
                        try {
                            const date = new Date(session.last_activity);
                            endTime = date.toString();
                        } catch (e) {
                            endTime = session.last_activity || '';
                        }
                    }

                    return {
                        teacherEmail: teacher?.email || '',
                        groupName: student.groupName || '',
                        school: student.school || '',
                        studentUsername: student?.username || '',
                        studentName: student?.full_name || '',
                        studentGender: student?.gender === 'Femenino' ? 'Female' : student?.gender === 'Masculino' ? 'Male' : '',
                        startTime: startTime,
                        endTime: endTime,
                        score: session?.final_score !== null && session?.final_score !== undefined ? session.final_score : '',
                        level: levelMap[student.categoryId] || 'N/A'
                    };
                });

                setReportData(reportData);
                console.log('📊 Report data:', reportData.length);

            } catch (error) {
                console.error('❌ ERROR:', error);
                setError(error.message);
                toast.error(t.error || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [t]);

    const exportToExcel = () => {
        try {
            if (reportData.length === 0) {
                toast.warning(t.noData || 'No hay datos para exportar');
                return;
            }

            const workbook = XLSX.utils.book_new();

            // Obtener todas las categorías únicas
            const categories = Object.keys(studentsByLevel).sort();
            console.log('📊 Categorías para Excel:', categories);

            // Si no hay categorías, crear una hoja general
            if (categories.length === 0) {
                const excelData = [
                    ['Teacher Email', 'Group name', 'School', 'Student Username', 'Student Name', 'Student Gender', 'Start Time', 'End Time', 'Score']
                ];

                reportData.forEach(row => {
                    excelData.push([
                        row.teacherEmail,
                        row.groupName,
                        row.school,
                        row.studentUsername,
                        row.studentName,
                        row.studentGender,
                        row.startTime,
                        row.endTime,
                        row.score
                    ]);
                });

                const worksheet = XLSX.utils.aoa_to_sheet(excelData);
                const colWidths = [
                    { wch: 35 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
                    { wch: 30 }, { wch: 15 }, { wch: 35 }, { wch: 35 }, { wch: 10 }
                ];
                worksheet['!cols'] = colWidths;
                XLSX.utils.book_append_sheet(workbook, worksheet, 'SPANISH_CU');
            } else {
                // Crear una hoja por categoría
                categories.forEach(category => {
                    const studentsInCategory = studentsByLevel[category] || [];
                    console.log(`📝 Creando hoja para ${category}: ${studentsInCategory.length} estudiantes`);

                    const excelData = [
                        ['Teacher Email', 'Group name', 'School', 'Student Username', 'Student Name', 'Student Gender', 'Start Time', 'End Time', 'Score']
                    ];

                    studentsInCategory.forEach(student => {
                        const session = reportData.find(r => r.studentUsername === student.username);
                        const teacherEmail = session?.teacherEmail || '';
                        const groupName = student.groupName || '';
                        const school = student.school || '';
                        const studentUsername = student?.username || '';
                        const studentName = student?.full_name || '';
                        const studentGender = student?.gender === 'Femenino' ? 'Female' : student?.gender === 'Masculino' ? 'Male' : '';
                        const startTime = session?.startTime || '';
                        const endTime = session?.endTime || '';
                        const score = session?.score || '';

                        excelData.push([
                            teacherEmail,
                            groupName,
                            school,
                            studentUsername,
                            studentName,
                            studentGender,
                            startTime,
                            endTime,
                            score
                        ]);
                    });

                    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
                    const colWidths = [
                        { wch: 35 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
                        { wch: 30 }, { wch: 15 }, { wch: 35 }, { wch: 35 }, { wch: 10 }
                    ];
                    worksheet['!cols'] = colWidths;

                    // Nombre de la hoja: SPANISH_NombreCategoria
                    const sheetName = `SPANISH_${category.replace(/\s/g, '_')}`;
                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                });
            }

            const fileName = `CU-Bebras-Results.xlsx`;
            XLSX.writeFile(workbook, fileName);
            toast.success(t.reportGenerated);

        } catch (error) {
            console.error('Error al exportar:', error);
            toast.error('Error al exportar el reporte');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-slate-600 opacity-50">
                            <ArrowLeft size={18} />
                            {t.back}
                        </button>
                        <h1 className="text-2xl font-extrabold text-slate-800">{t.title}</h1>
                    </div>
                    <div className="animate-pulse">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-32 bg-slate-200 rounded-2xl"></div>
                            <div className="h-32 bg-slate-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-slate-600 hover:bg-slate-50">
                        <ArrowLeft size={18} /> {t.back}
                    </button>
                    <div className="mt-8 bg-red-50 rounded-2xl p-8 text-center border border-red-200">
                        <p className="text-red-600 text-lg font-semibold">{t.error}</p>
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-slate-600 hover:bg-slate-50">
                        <ArrowLeft size={18} /> {t.back}
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800">{t.title}</h1>
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                        {['es', 'en', 'pt', 'fr'].map((lng) => (
                            <button key={lng} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === lng ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => onLanguageChange(lng)}>
                                {lng.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Columna izquierda - Tarjetas */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* 1. Profesores */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                                <GraduationCap size={28} className="mb-2 opacity-80" />
                                <p className="text-3xl font-bold">{stats.teachers}</p>
                                <p className="text-sm opacity-90">{t.teachers}</p>
                            </div>
                            {/* 2. Estudiantes */}
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
                                <Users size={28} className="mb-2 opacity-80" />
                                <p className="text-3xl font-bold">{stats.students}</p>
                                <p className="text-sm opacity-90">{t.students}</p>
                            </div>
                        </div>

                        {/* Distribución por niveles */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                                <Flag size={20} className="text-blue-600" />
                                Distribución por Niveles
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.keys(studentsByLevel).sort().map(level => (
                                    <div key={level} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                        <p className="text-xl font-bold text-blue-600">{studentsByLevel[level].length}</p>
                                        <p className="text-xs text-slate-600">{level}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 mt-3">
                                Total registros: <span className="font-bold">{reportData.length}</span>
                            </p>
                        </div>
                    </div>

                    {/* Columna derecha - Exportar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Download size={20} className="text-blue-600" />
                                {t.exportReport}
                            </h3>
                            <p className="text-slate-500 text-sm mb-2">
                                Exportar reporte con {reportData.length} registros
                            </p>
                            <p className="text-slate-500 text-sm mb-6">
                                {Object.keys(studentsByLevel).length} hojas por categoría
                            </p>
                            <button onClick={exportToExcel} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md">
                                <FileSpreadsheet size={18} />
                                {t.exportReport} (Excel)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reportes_Estadisticas;