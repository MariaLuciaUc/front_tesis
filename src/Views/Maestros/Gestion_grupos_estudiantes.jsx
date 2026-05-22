import React, { useState } from 'react';
import Crear_Grupo from './Crear_Grupo';
import Crear_cuentas_alumnos from './Crear_cuentas_alumnos';
import Monitoreo_participantes from './Monitoreo_participantes.jsx';
import castorcubasi from '/src/castorcubasi.jpg';
import {Users, Plus, Globe, BookOpen, Lock, Trophy, X, Edit, Trash2, Save, CheckCircle, UserPlus, Clock, BarChart3, AlertCircle, ShieldOff, Play, Download, FileDown, FileText, FileSpreadsheet} from 'lucide-react';
import {toast} from "sonner";
import Exportar_diploma_alumno from './Exportar_diploma_alumno';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Gestion_grupos_estudiantes = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCrearCuentas, setShowCrearCuentas] = useState(false);
    const [showGestionParticipantes, setShowGestionParticipantes] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editFormData, setEditFormData] = useState({ username: '', name: '', researchPermission: false });
    const [language, setLanguage] = useState('es');
    const [showRanking, setShowRanking] = useState(false);
    const [showExportDiplomas, setShowExportDiplomas] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    const handleGroupCreated = (newGroup) => {
        setGroups([...groups, { ...newGroup, students: [], challengeClosed: false }]);
        setSelectedGroupId(newGroup.id);
        setShowCreateGroup(false);
    };

    const handleStudentsCreated = (listaNombres, genero) => {
        if (!selectedGroup) return;
        const nuevosEstudiantes = listaNombres.map((nombre, index) => ({
            id: Date.now().toString() + index,
            username: nombre.toLowerCase().replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            name: nombre,
            genero: genero,
            researchPermission: false,
            status: 'not_started',
            score: null,
            startTime: null,
            endTime: null,
            calculatedScore: null
        }));
        setGroups(groups.map(group =>
            group.id === selectedGroup.id
                ? { ...group, students: [...group.students, ...nuevosEstudiantes] }
                : group
        ));
        setShowCrearCuentas(false);
    };

    const handleUpdateStudentStatus = (updatedStudents) => {
        if (!selectedGroup) return;
        setGroups(groups.map(group =>
            group.id === selectedGroup.id
                ? { ...group, students: updatedStudents }
                : group
        ));
    };

    const publishScores = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length===0){
            toast.warning("No hay estudiantes inscritos en este grupo")
        } else {
            if (window.confirm('¿Cerrar este desafío y publicar las puntuaciones? Los estudiantes no podrán cambiar sus respuestas.')) {
                setGroups(groups.map(group =>
                    group.id === selectedGroup.id
                        ? {
                            ...group,
                            challengeClosed: true,
                            students: group.students.map(student => ({
                                ...student,
                                score: student.calculatedScore !== null ? student.calculatedScore : Math.floor(Math.random() * 101)
                            }))
                        }
                        : group
                ));
            }
        }

    };

    const printDiplomas = () => {
        if (!selectedGroup) return;
        if (!selectedGroup.challengeClosed) {
            toast.warning('Primero debe cerrar el desafío y publicar las puntuaciones');
            return;
        }
        if (selectedGroup.students.length === 0) {
            toast.warning('No hay estudiantes en este grupo');
            return;
        }
        setShowExportDiplomas(true);
    };

    const handleCloseDiplomas = () => {
        setShowExportDiplomas(false);
    };

    const showRankingTable = () => {
        if (!selectedGroup) return;
        setShowRanking(true);
    };

    const handleExportReport = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) {
            toast.warning('No hay estudiantes en este grupo');
            return;
        }
        setShowExportOptions(true);
    };

    const getBebrasLevel = (course) => {
        const levels = {
            'Preescolar': 'Castorito (5-6 años)',
            '1ro': 'Castor (7-8 años)',
            '2do': 'Castor (7-8 años)',
            '3ro': 'Castor (9-10 años)',
            '4to': 'Castor (9-10 años)',
            '5to': 'Castor (11-12 años)',
            '6to': 'Castor (11-12 años)',
            '7mo': 'Junior (13-14 años)',
            '8vo': 'Junior (13-14 años)',
            '9no': 'Junior (13-14 años)',
            '10mo': 'Senior (15-16 años)',
            '11no': 'Senior (15-16 años)',
            '12mo': 'Senior (17-18 años)'
        };
        return levels[course] || 'No especificado';
    };

    const generateReportData = () => {
        if (!selectedGroup) return [];

        return selectedGroup.students.map(student => ({
            'Nombre del Estudiante': student.name,
            'Nombre de Usuario': student.username,
            'Género': student.genero || 'No especificado',
            'Grupo': selectedGroup.name,
            'Nivel Bebras': selectedGroup.course,
            'Idioma del Desafío': selectedGroup.language === 'es' ? 'Español' : selectedGroup.language === 'en' ? 'Inglés' : selectedGroup.language,
            'Estado': student.status === 'finished' ? 'Finalizado' : student.status === 'in_progress' ? 'En progreso' : 'No comenzado',
            'Puntuación': student.score !== null && student.score !== undefined ? student.score : 'No disponible',
            'Permiso de Investigación': student.researchPermission ? 'Sí' : 'No',
            'Hora de Inicio': student.startTime ? new Date(student.startTime).toLocaleString() : 'No iniciado',
            'Hora de Finalización': student.endTime ? new Date(student.endTime).toLocaleString() : 'No finalizado'
        }));
    };

    const exportToExcel = () => {
        try {
            const reportData = generateReportData();
            const worksheet = XLSX.utils.json_to_sheet(reportData);

            // Adjust column widths
            const colWidths = [
                {wch: 25}, {wch: 20}, {wch: 12}, {wch: 20},
                {wch: 15}, {wch: 25}, {wch: 15}, {wch: 15},
                {wch: 12}, {wch: 18}, {wch: 20}, {wch: 20}
            ];
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Reporte_${selectedGroup.name}`);

            // Add summary sheet
            const summaryData = [
                ['RESUMEN DEL GRUPO'],
                [''],
                ['Nombre del Grupo', selectedGroup.name],
                ['Año/Nivel', selectedGroup.course],
                ['Nivel Bebras', getBebrasLevel(selectedGroup.course)],
                ['Idioma', selectedGroup.language === 'es' ? 'Español' : 'Inglés'],
                ['Total de Estudiantes', selectedGroup.students.length],
                ['Desafío Cerrado', selectedGroup.challengeClosed ? 'Sí' : 'No'],
                [''],
                ['ESTADÍSTICAS DE PARTICIPACIÓN'],
                [''],
                ['Total Finalizados', selectedGroup.students.filter(s => s.status === 'finished').length],
                ['Total En Progreso', selectedGroup.students.filter(s => s.status === 'in_progress').length],
                ['Total No Comenzados', selectedGroup.students.filter(s => s.status === 'not_started').length],
                [''],
                ['RENDIMIENTO'],
                [''],
                ['Puntuación Promedio', (() => {
                    const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score);
                    return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 'N/A';
                })()],
                ['Puntuación Más Alta', (() => {
                    const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score);
                    return scores.length > 0 ? Math.max(...scores) : 'N/A';
                })()],
                ['Puntuación Más Baja', (() => {
                    const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score);
                    return scores.length > 0 ? Math.min(...scores) : 'N/A';
                })()],
                ['Tasa de Finalización', `${((selectedGroup.students.filter(s => s.status === 'finished').length / selectedGroup.students.length) * 100).toFixed(1)}%`]
            ];

            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            summarySheet['!cols'] = [{wch: 25}, {wch: 30}];
            XLSX.utils.book_append_sheet(workbook, summarySheet, `Resumen_${selectedGroup.name}`);

            XLSX.writeFile(workbook, `Reporte_participacion_${selectedGroup.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Reporte exportado exitosamente en formato Excel');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error('Error al exportar a Excel');
        }
        setShowExportOptions(false);
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const reportData = generateReportData();

            // Add title
            doc.setFontSize(18);
            doc.setTextColor(33, 33, 33);
            doc.text(`Reporte de Participación - ${selectedGroup.name}`, 14, 20);

            // Add metadata
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Nivel Bebras: ${selectedGroup.course}`, 14, 37);
            doc.text(`Idioma: ${selectedGroup.language === 'es' ? 'Español' : 'Inglés'}`, 14, 51);
            doc.text(`Total de estudiantes: ${selectedGroup.students.length}`, 14, 58);
            doc.text(`Desafío cerrado: ${selectedGroup.challengeClosed ? 'Sí' : 'No'}`, 14, 65);

            // Add statistics
            const finished = selectedGroup.students.filter(s => s.status === 'finished').length;
            const inProgress = selectedGroup.students.filter(s => s.status === 'in_progress').length;
            const notStarted = selectedGroup.students.filter(s => s.status === 'not_started').length;
            const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score);
            const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 'N/A';
            const highestScore = scores.length > 0 ? Math.max(...scores) : 'N/A';
            const completionRate = ((finished / selectedGroup.students.length) * 100).toFixed(1);

            doc.setFontSize(10);
            doc.setTextColor(33, 33, 33);
            doc.text(`Estadísticas:`, 14, 75);
            doc.text(`• Finalizados: ${finished}`, 20, 82);
            doc.text(`• En progreso: ${inProgress}`, 20, 89);
            doc.text(`• No comenzados: ${notStarted}`, 20, 96);
            doc.text(`• Puntuación promedio: ${avgScore}`, 20, 103);
            doc.text(`• Puntuación más alta: ${highestScore}`, 20, 110);
            doc.text(`• Tasa de finalización: ${completionRate}%`, 20, 117);

            // Create table
            const tableData = reportData.map(student => [
                student['Nombre del Estudiante'],
                student['Nombre de Usuario'],
                student['Género'],
                student['Estado'],
                student['Puntuación'],
                student['Permiso de Investigación']
            ]);

            doc.autoTable({
                startY: 125,
                head: [['Nombre', 'Usuario', 'Género', 'Estado', 'Puntuación', 'Permiso']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
                bodyStyles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { left: 14, right: 14 },
                didDrawPage: (data) => {
                    // Add footer
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(`Página ${data.pageNumber} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
                }
            });

            doc.save(`Reporte_participacion_${selectedGroup.name}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Reporte exportado exitosamente en formato PDF');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            toast.error('Error al exportar a PDF');
        }
        setShowExportOptions(false);
    };

    const handleEditStudent = (student) => {
        setEditingStudentId(student.id);
        setEditFormData({
            username: student.username,
            name: student.name,
            researchPermission: student.researchPermission,
        });
    };

    const toggleResearchPermission = (studentId) => {
        if (!selectedGroup) return;
        setGroups(groups.map(group =>
            group.id === selectedGroup.id
                ? {
                    ...group,
                    students: group.students.map(student =>
                        student.id === studentId
                            ? { ...student, researchPermission: !student.researchPermission }
                            : student
                    )
                }
                : group
        ));
    };

    const removeAllResearchPermissions = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length===0){
            toast.warning("No hay estudiantes inscritos en este grupo")
        } else {
            if (window.confirm('¿Quitar permiso de investigación a TODOS los estudiantes? (Requerido para CUBA)')) {
                setGroups(groups.map(group =>
                    group.id === selectedGroup.id
                        ? {
                            ...group,
                            students: group.students.map(student => ({
                                ...student,
                                researchPermission: false
                            }))
                        }
                        : group
                ));
            }
        }

    };

    const handleSaveEdit = (studentId) => {
        if (!selectedGroup) return;
        setGroups(groups.map(group =>
            group.id === selectedGroup.id
                ? {
                    ...group,
                    students: group.students.map(student =>
                        student.id === studentId
                            ? { ...student, ...editFormData }
                            : student
                    ),
                }
                : group
        ));
        setEditingStudentId(null);
    };

    const handleDeleteStudent = (studentId) => {
        if (!selectedGroup) return;
        if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            setGroups(groups.map(group =>
                group.id === selectedGroup.id
                    ? { ...group, students: group.students.filter(s => s.id !== studentId) }
                    : group
            ));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'finished': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} /> Finalizado</span>;
            case 'in_progress': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Play size={12} /> En progreso</span>;
            default: return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"><Clock size={12} /> No comenzado</span>;
        }
    };

    const handleGestionarParticipantes = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) {
            toast.warning('No hay estudiantes en este grupo. Primero debe agregar estudiantes usando el botón "Crear cuentas".');
            return;
        }
        setShowGestionParticipantes(true);
    };

    if (showCreateGroup) return <Crear_Grupo onGroupCreated={handleGroupCreated} onCancel={()=>setShowCreateGroup(false)} />;
    if (showCrearCuentas) return <Crear_cuentas_alumnos onStudentsCreated={handleStudentsCreated} onCancel={() => setShowCrearCuentas(false)} />;
    if (showGestionParticipantes) return <Monitoreo_participantes group={selectedGroup} onUpdateStudentStatus={handleUpdateStudentStatus} onClose={() => setShowGestionParticipantes(false)} />;
    if (showExportDiplomas) return <Exportar_diploma_alumno group={selectedGroup} onClose={handleCloseDiplomas} />;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-sky-100 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Language Selector */}
                <div className="flex justify-end mb-4 gap-2 bg-slate-100 p-1 rounded-full w-fit ml-auto border border-slate-200">
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

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <img src={castorcubasi} alt="castorcubasi" className="w-30 h-30 shadow-md"/>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800">Desafío Bebras</h1>
                            <p className="text-slate-500">Vista del Profesor</p>
                        </div>
                    </div>
                </div>

                {/* Seleccion grupos */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users size={20} className="text-blue-600" /> Grupos</h2>
                        <button onClick={() => setShowCreateGroup(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md">
                            <Plus size={18} /> Crear Grupo
                        </button>
                    </div>

                    {groups.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 mb-4">No hay grupos creados</p>
                            <button onClick={() => setShowCreateGroup(true)} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all">
                                Crear primer grupo
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Seleccionar grupo:</label>
                                <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)} className="w-full md:w-64 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                    {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
                                </select>
                            </div>

                            {selectedGroup && (
                                <>
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                                        <h3 className="text-lg font-bold text-slate-800">{selectedGroup.name}</h3>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Globe size={14} /> {selectedGroup.language}</span>
                                            <span className="inline-flex items-center gap-1 text-sm text-slate-600"><BookOpen size={14} /> {selectedGroup.course}</span>
                                            <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Users size={14} /> {selectedGroup.students.length} estudiantes</span>
                                            {selectedGroup.challengeClosed && <span className="inline-flex items-center gap-1 text-sm text-red-600"><Lock size={14} /> Desafío cerrado</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mb-8">
                                        <button onClick={handleGestionarParticipantes} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md">
                                            <Users size={16} /> Monitorear participantes
                                        </button>
                                        {!selectedGroup.challengeClosed && (
                                            <button onClick={publishScores} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-all shadow-md">
                                                <BarChart3 size={16} /> Cerrar desafío y publicar puntuaciones
                                            </button>
                                        )}
                                        {selectedGroup.challengeClosed && (
                                            <>
                                                <button onClick={printDiplomas} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md">
                                                    <FileDown size={16} /> Exportar diplomas de participación de estudiantes
                                                </button>
                                                <button onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-all shadow-md">
                                                    <Download size={16} /> Exportar reporte de participación de grupo
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-blue-600" /> Estudiantes</h2>
                                            <div className="flex gap-2">
                                                <button onClick={() => setShowCrearCuentas(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all shadow-md">
                                                    <UserPlus size={16} /> Crear cuentas
                                                </button>
                                                <button onClick={removeAllResearchPermissions} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-md" title="Quitar permiso de investigación a todos (CUBA)">
                                                    <ShieldOff size={16} /> Quitar todos permisos
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Usuario</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Nombre</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Género</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Puntuación</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Permiso</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Estado</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Acciones</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {selectedGroup.students.map(student => (
                                                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                        {editingStudentId === student.id ? (
                                                            <>
                                                                <td className="px-4 py-2"><input value={editFormData.username} onChange={(e) => setEditFormData({...editFormData, username: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200" /></td>
                                                                <td className="px-4 py-2"><input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200" /></td>
                                                                <td className="px-4 py-2">{student.genero || '—'}</td>
                                                                <td className="px-4 py-2">{student.score !== undefined && student.score !== null ? student.score : '—'}</td>
                                                                <td className="px-4 py-2"><input type="checkbox" checked={editFormData.researchPermission} onChange={(e) => setEditFormData({...editFormData, researchPermission: e.target.checked})} className="w-4 h-4" /></td>
                                                                <td className="px-4 py-2">{getStatusBadge(student.status)}</td>
                                                                <td className="px-4 py-2 flex gap-2">
                                                                    <button onClick={() => handleSaveEdit(student.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={16} /></button>
                                                                    <button onClick={() => setEditingStudentId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={16} /></button>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-4 py-2 text-sm">{student.username}</td>
                                                                <td className="px-4 py-2 text-sm font-medium">{student.name}</td>
                                                                <td className="px-4 py-2 text-sm">{student.genero || '—'}</td>
                                                                <td className="px-4 py-2 text-sm font-bold">{student.score !== undefined && student.score !== null ? student.score : '—'}</td>
                                                                <td className="px-4 py-2"><input type="checkbox" checked={student.researchPermission} onChange={() => toggleResearchPermission(student.id)} className="w-4 h-4" /></td>
                                                                <td className="px-4 py-2">{getStatusBadge(student.status)}</td>
                                                                <td className="px-4 py-2 flex gap-2">
                                                                    <button onClick={() => handleEditStudent(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                                                    <button onClick={() => handleDeleteStudent(student.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                                {selectedGroup.students.length === 0 && (
                                                    <tr><td colSpan="7" className="text-center py-8 text-slate-500">No hay estudiantes. Haz clic en "Crear cuentas"</td></tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Descripcion del maestro */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><AlertCircle size={18} className="text-blue-600" /> Bienvenidos al Desafío Bebras</h3>
                    <p className="text-slate-600 text-sm mb-2">Ahora está ubicado en la vista del maestro donde puede crear y administrar grupos, crear y modificar cuentas de estudiantes y ver los resultados del desafío. También podrá imprimir los certificados de los estudiantes después del desafío.</p>
                    <p className="text-slate-600 text-sm mb-2">Hay un menú desplegable aquí en la parte superior de la página. Allí podrá seleccionar el grupo que desea ver y administrar. Desde allí también puede agregar nuevos grupos.</p>
                    <p className="text-slate-600 text-sm mb-2">Desplácese hacia abajo un botón para crear la cuenta de cada uno de los estudiantes por grupo.</p>
                    <p className="text-slate-600 text-sm mb-2">Durante el desafío, puedes ver el estado de los estudiantes y las marcas de tiempo para iniciar y cerrar el desafío con el botón Gestionar los estudiantes.</p>
                    <p className="text-slate-600 text-sm mb-2">Una vez que finalice todo el grupo, puede hacer clic en el botón Cerrar este desafío y publicar las puntuaciones.</p>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl mt-3 flex items-center gap-2"><ShieldOff size={16} /> <strong>IMPORTANTE (CUBA):</strong> Debe quitar la marca de verificación del permiso de investigación a TODOS los estudiantes usando el botón "Quitar todos permisos".</p>
                </div>

                {/* Export Options Modal */}
                {showExportOptions && selectedGroup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExportOptions(false)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Download size={20} className="text-yellow-500" />
                                    Exportar Reporte - {selectedGroup.name}
                                </h2>
                                <button onClick={() => setShowExportOptions(false)} className="p-1 rounded-full hover:bg-slate-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-slate-600 mb-6 text-sm">
                                Seleccione el formato en el que desea exportar el reporte de participación del grupo.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={exportToExcel}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md"
                                >
                                    <FileSpreadsheet size={20} />
                                    Excel (.xlsx)
                                </button>
                                <button
                                    onClick={exportToPDF}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-md"
                                >
                                    <FileText size={20} />
                                    PDF (.pdf)
                                </button>
                            </div>

                            <button
                                onClick={() => setShowExportOptions(false)}
                                className="w-full mt-4 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Ranking */}
                {showRanking && selectedGroup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRanking(false)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-[fadeInUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Ranking - {selectedGroup.name}</h2>
                                <button onClick={() => setShowRanking(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={20} /></button>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 flex items-center gap-1"><BookOpen size={14} /> Mismo grupo de edad: {selectedGroup.course}</p>
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                <tr><th className="px-4 py-2 text-left">Posición</th><th className="px-4 py-2 text-left">Puntuación</th><th className="px-4 py-2 text-left">Cantidad</th></tr>
                                </thead>
                                <tbody>
                                {(() => {
                                    const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score);
                                    const scoreCounts = {};
                                    scores.forEach(score => { scoreCounts[score] = (scoreCounts[score] || 0) + 1; });
                                    const sortedScores = Object.keys(scoreCounts).map(Number).sort((a, b) => b - a);
                                    return sortedScores.map((score, idx) => (
                                        <tr key={score} className="border-b border-slate-100">
                                            <td className="px-4 py-2 font-bold">{idx + 1}</td>
                                            <td className="px-4 py-2">{score}</td>
                                            <td className="px-4 py-2">{scoreCounts[score]} estudiante(s)</td>
                                        </tr>
                                    ));
                                })()}
                                {selectedGroup.students.filter(s => s.score !== null).length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-4 text-slate-500">No hay puntuaciones disponibles</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gestion_grupos_estudiantes;