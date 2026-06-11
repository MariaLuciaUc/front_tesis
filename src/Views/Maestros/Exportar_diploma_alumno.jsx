import React, { useState } from 'react';
import { X, Search, Download, Award, User, FileText, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const translations = {
    es: {
        title: "Exportar Diplomas",
        group: "Grupo",
        level: "Nivel Bebras",
        participantsWithScore: "Participantes con puntuación",
        searchStudent: "Buscar estudiante",
        searchPlaceholder: "Buscar por nombre o usuario...",
        students: "Estudiantes",
        name: "Nombre",
        username: "Usuario",
        score: "Puntuación",
        action: "Acción",
        download: "Descargar",
        noScore: "Sin puntuación",
        noStudents: "No se encontraron estudiantes",
        downloadAll: "Descargar todos los diplomas",
        generating: "Generando...",
        warningNoScores: "No hay puntuaciones publicadas. Primero debe cerrar el desafío y publicar las puntuaciones.",
        close: "Cerrar"
    },
    en: {
        title: "Export Diplomas",
        group: "Group",
        level: "Bebras Level",
        participantsWithScore: "Participants with score",
        searchStudent: "Search student",
        searchPlaceholder: "Search by name or username...",
        students: "Students",
        name: "Name",
        username: "Username",
        score: "Score",
        action: "Action",
        download: "Download",
        noScore: "No score",
        noStudents: "No students found",
        downloadAll: "Download all diplomas",
        generating: "Generating...",
        warningNoScores: "No scores published. You must first close the challenge and publish the scores.",
        close: "Close"
    },
    pt: {
        title: "Exportar Diplomas",
        group: "Grupo",
        level: "Nível Bebras",
        participantsWithScore: "Participantes com pontuação",
        searchStudent: "Buscar estudante",
        searchPlaceholder: "Buscar por nome ou usuário...",
        students: "Estudantes",
        name: "Nome",
        username: "Usuário",
        score: "Pontuação",
        action: "Ação",
        download: "Baixar",
        noScore: "Sem pontuação",
        noStudents: "Nenhum estudante encontrado",
        downloadAll: "Baixar todos os diplomas",
        generating: "Gerando...",
        warningNoScores: "Nenhuma pontuação publicada. Primeiro você deve fechar o desafio e publicar as pontuações.",
        close: "Fechar"
    },
    fr: {
        title: "Exporter les diplômes",
        group: "Groupe",
        level: "Niveau Bebras",
        participantsWithScore: "Participants avec score",
        searchStudent: "Rechercher un élève",
        searchPlaceholder: "Rechercher par nom ou nom d'utilisateur...",
        students: "Élèves",
        name: "Nom",
        username: "Nom d'utilisateur",
        score: "Score",
        action: "Action",
        download: "Télécharger",
        noScore: "Pas de score",
        noStudents: "Aucun élève trouvé",
        downloadAll: "Télécharger tous les diplômes",
        generating: "Génération...",
        warningNoScores: "Aucun score publié. Vous devez d'abord clore le défi et publier les scores.",
        close: "Fermer"
    }
};

const Exportar_diploma_alumno = ({ group, onClose, language = 'es' }) => {
    const t = translations[language];
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const filteredStudents = group.students.filter(student =>
        (student.full_name || student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const studentsWithScores = group.students.filter(s => s.score !== null && s.score !== undefined);

    const generateDiplomaPDF = async (student, isSingle = true) => {
        return new Promise((resolve, reject) => {
            try {
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Marco decorativo exterior
                doc.setDrawColor(203, 21, 21);
                doc.setLineWidth(1.5);
                doc.rect(10, 10, 190, 277);

                // Marco interior
                doc.setDrawColor(0, 42, 143);
                doc.setLineWidth(0.8);
                doc.rect(14, 14, 182, 269);

                // Banda superior decorativa (franjas de Cuba)
                doc.setFillColor(203, 21, 21);
                doc.rect(14, 14, 60, 12, 'F');
                doc.setFillColor(0, 42, 143);
                doc.rect(74, 14, 60, 12, 'F');
                doc.setFillColor(203, 21, 21);
                doc.rect(134, 14, 62, 12, 'F');

                // Título principal
                doc.setFontSize(24);
                doc.setTextColor(203, 21, 21);
                doc.setFont('helvetica', 'bold');
                doc.text("DESAFÍO BEBRAS CUBA", 105, 55, { align: 'center' });

                // Subtítulo
                doc.setFontSize(14);
                doc.setTextColor(0, 42, 143);
                doc.setFont('helvetica', 'italic');
                doc.text("Edición 2026", 105, 68, { align: 'center' });

                // Línea decorativa
                doc.setDrawColor(203, 21, 21);
                doc.setLineWidth(0.5);
                doc.line(50, 78, 160, 78);

                // Texto del certificado
                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);
                doc.setFont('helvetica', 'normal');
                doc.text("Este certificado se otorga a:", 105, 95, { align: 'center' });

                // Nombre del estudiante
                const nombreEstudiante = student.full_name || student.name || 'Estudiante';
                doc.setFontSize(28);
                doc.setTextColor(0, 42, 143);
                doc.setFont('helvetica', 'bold');

                // Dividir nombre si es muy largo
                const nombreParts = doc.splitTextToSize(nombreEstudiante, 160);
                let nombreY = 115;
                nombreParts.forEach((part, idx) => {
                    doc.text(part, 105, nombreY + (idx * 10), { align: 'center' });
                });

                const alturaNombre = nombreParts.length * 10;

                // Texto de reconocimiento
                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);
                doc.setFont('helvetica', 'normal');
                doc.text("por su destacada participación en el", 105, 125 + alturaNombre, { align: 'center' });

                // Información del grupo
                doc.setFontSize(14);
                doc.setTextColor(203, 21, 21);
                doc.setFont('helvetica', 'bold');
                doc.text(`Grupo: ${group.name}`, 105, 145 + alturaNombre, { align: 'center' });

                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);
                doc.setFont('helvetica', 'normal');
                doc.text(`Nivel: ${group.course}`, 105, 160 + alturaNombre, { align: 'center' });

                // Puntuación
                if (student.score !== null && student.score !== undefined) {
                    doc.setFontSize(13);
                    doc.setTextColor(0, 42, 143);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Puntuación obtenida: ${student.score} puntos`, 105, 180 + alturaNombre, { align: 'center' });
                }

                // Fecha
                const fecha = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : language === 'pt' ? 'pt-PT' : 'fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                doc.setFontSize(10);
                doc.setTextColor(120, 120, 120);
                doc.setFont('helvetica', 'italic');
                doc.text(fecha, 105, 210 + alturaNombre, { align: 'center' });

                // Línea de firma
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.3);
                doc.line(50, 240 + alturaNombre, 160, 240 + alturaNombre);

                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.text("Coordinación Desafío Bebras Cuba", 105, 252 + alturaNombre, { align: 'center' });

                if (isSingle) {
                    doc.save(`Diploma_${nombreEstudiante.replace(/\s/g, '_')}.pdf`);
                }

                resolve(doc);
            } catch (error) {
                reject(error);
            }
        });
    };

    const downloadPDF = async (student) => {
        if (student.score === null || student.score === undefined) {
            toast.error(t.noScore);
            return;
        }

        if (isGenerating) {
            toast.warning('Espere...');
            return;
        }

        setIsGenerating(true);
        toast.loading(`Generando diploma para ${student.full_name || student.name}...`);

        try {
            await generateDiplomaPDF(student, true);
            toast.dismiss();
            toast.success(`Diploma descargado: ${student.full_name || student.name}`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            toast.dismiss();
            toast.error('Error al generar el diploma');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadAllDiplomas = async () => {
        if (isGenerating) {
            toast.warning('Espere...');
            return;
        }

        setIsGenerating(true);
        toast.loading(`Preparando ${studentsWithScores.length} diplomas...`);

        for (let i = 0; i < studentsWithScores.length; i++) {
            const student = studentsWithScores[i];
            try {
                await generateDiplomaPDF(student, true);
                await new Promise(resolve => setTimeout(resolve, 500));
                toast.dismiss();
                toast.loading(`Descargando ${i + 1} de ${studentsWithScores.length}...`);
            } catch (error) {
                console.error(`Error al generar diploma para ${student.full_name || student.name}:`, error);
            }
        }

        toast.dismiss();
        toast.success(`${studentsWithScores.length} diplomas descargados`);
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Award className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-extrabold text-slate-800">{t.title}</h2>
                    </div>
                    <button onClick={onClose} disabled={isGenerating} className="p-2 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-500">{t.group}</p>
                                <p className="font-bold text-slate-800 text-lg">{group.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{t.level}</p>
                                <p className="font-bold text-slate-800">{group.course}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{t.participantsWithScore}</p>
                                <p className="font-bold text-green-600 text-lg">{studentsWithScores.length} / {group.students.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t.searchStudent}</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t.searchPlaceholder}
                                disabled={isGenerating}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <User size={18} className="text-blue-600" /> {t.students} ({filteredStudents.length})
                        </h3>
                        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.name}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.username}</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">{t.score}</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">{t.action}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStudents.map((student, idx) => (
                                    <tr key={student.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{student.full_name || student.name || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500">{student.username || '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            {student.score !== null && student.score !== undefined ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                                                        {student.score} pts
                                                    </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">{t.noScore}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => downloadPDF(student)}
                                                disabled={student.score === null || student.score === undefined || isGenerating}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all mx-auto ${
                                                    student.score !== null && student.score !== undefined && !isGenerating
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <FileDown size={14} /> {t.download}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {filteredStudents.length === 0 && (
                                <div className="text-center py-8 text-slate-500">{t.noStudents}</div>
                            )}
                        </div>
                    </div>

                    {studentsWithScores.length > 0 && (
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={downloadAllDiplomas}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
                            >
                                <Download size={18} /> {isGenerating ? t.generating : t.downloadAll}
                            </button>
                        </div>
                    )}

                    {studentsWithScores.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-sm text-yellow-800 flex items-center gap-2">
                                <FileText size={16} /> {t.warningNoScores}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exportar_diploma_alumno;