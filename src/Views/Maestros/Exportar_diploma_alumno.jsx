import React, { useState } from 'react';
import { X, Search, Download, Award, User, FileText, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const studentsWithScores = group.students.filter(s => s.score !== null && s.score !== undefined);

    const getDiplomaHTML = (student, group) => {
        return `<!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
      .diploma { width: 800px; background: white; border: 15px solid #cb1515; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; }
      .diploma::before { content: ''; position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 2px solid #002a8f; border-radius: 10px; pointer-events: none; }
      .header-strip { background: linear-gradient(135deg, #cb1515 0%, #cb1515 33%, #ffffff 33%, #ffffff 66%, #002a8f 66%, #002a8f 100%); height: 60px; width: 100%; margin-bottom: 30px; border-radius: 10px; }
      .title { font-size: 32px; font-weight: bold; color: #cb1515; letter-spacing: 4px; margin-bottom: 10px; }
      .subtitle { font-size: 18px; color: #002a8f; margin-bottom: 30px; font-style: italic; }
      .certificate-text { font-size: 18px; color: #333; margin: 20px 0; }
      .student-name { font-size: 36px; font-weight: bold; color: #002a8f; margin: 20px 0; padding: 15px 30px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 15px; display: inline-block; border-left: 5px solid #cb1515; border-right: 5px solid #cb1515; }
      .group-info { font-size: 14px; color: #666; margin: 20px 0; line-height: 1.6; }
      .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
      .signature { text-align: center; flex: 1; }
      .signature-line { width: 80%; border-top: 2px solid #002a8f; margin: 0 auto 10px auto; padding-top: 10px; }
      .signature-text { font-size: 12px; color: #666; }
      .cuba-flag-decoration { display: flex; justify-content: center; gap: 5px; margin: 20px 0; }
      .flag-stripe { width: 30px; height: 20px; }
      .stripe-red { background-color: #cb1515; }
      .stripe-white { background-color: #ffffff; border: 1px solid #ddd; }
      .stripe-blue { background-color: #002a8f; }
      .date { font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style></head>
    <body>
      <div class="diploma">
        <div class="header-strip"></div>
        <div class="cuba-flag-decoration"><div class="flag-stripe stripe-red"></div><div class="flag-stripe stripe-white"></div><div class="flag-stripe stripe-blue"></div><div class="flag-stripe stripe-red"></div><div class="flag-stripe stripe-white"></div><div class="flag-stripe stripe-blue"></div></div>
        <div class="title">Desafío BebrasCuba Edición 2026</div>
        <div class="subtitle">Certificado Oficial de Participación</div>
        <div class="certificate-text">Se otorga el presente certificado a:</div>
        <div class="student-name">${student.name}</div>
        <div class="group-info"><strong>Grupo:</strong> ${group.name}<br><strong>Nivel Bebras:</strong> ${group.course}</div>
        <div class="signatures"><div class="signature"><div class="signature-line"></div><div class="signature-text">Firma del Director</div></div><div class="signature"><div class="signature-line"></div><div class="signature-text">Sello Oficial</div></div></div>
        <div class="date">${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : language === 'pt' ? 'pt-PT' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </body>
    </html>`;
    };

    const downloadPDF = async (student) => {
        if (isGenerating) { toast.warning('Wait...'); return; }
        setIsGenerating(true);
        try {
            toast.loading(`Generating diploma for ${student.name}...`);
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute'; iframe.style.top = '-9999px'; iframe.style.left = '-9999px';
            iframe.style.width = '800px'; iframe.style.height = '600px';
            document.body.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            doc.open(); doc.write(getDiplomaHTML(student, group)); doc.close();
            await new Promise(resolve => setTimeout(resolve, 500));
            const canvas = await html2canvas(iframe.contentDocument.body, { scale: 3, backgroundColor: '#ffffff', logging: false, useCORS: true, windowWidth: 800 });
            document.body.removeChild(iframe);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgWidth = 190; const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`Diploma_${student.name.replace(/\s/g, '_')}.pdf`);
            toast.dismiss(); toast.success(`Diploma downloaded: ${student.name}`);
        } catch (error) { console.error(error); toast.dismiss(); toast.error('Error generating PDF'); }
        finally { setIsGenerating(false); }
    };

    const downloadAllDiplomas = async () => {
        if (isGenerating) { toast.warning('Please wait'); return; }
        setIsGenerating(true);
        toast.loading(`Preparing ${studentsWithScores.length} diplomas...`);
        for (let i = 0; i < studentsWithScores.length; i++) {
            const student = studentsWithScores[i];
            try {
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute'; iframe.style.top = '-9999px'; iframe.style.left = '-9999px';
                iframe.style.width = '800px'; iframe.style.height = '600px';
                document.body.appendChild(iframe);
                const doc = iframe.contentWindow.document;
                doc.open(); doc.write(getDiplomaHTML(student, group)); doc.close();
                await new Promise(resolve => setTimeout(resolve, 300));
                const canvas = await html2canvas(iframe.contentDocument.body, { scale: 3, backgroundColor: '#ffffff', logging: false, useCORS: true, windowWidth: 800 });
                document.body.removeChild(iframe);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const imgWidth = 190; const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                pdf.save(`Diploma_${student.name.replace(/\s/g, '_')}.pdf`);
                await new Promise(resolve => setTimeout(resolve, 500));
                toast.dismiss(); toast.loading(`Downloading ${i+1} of ${studentsWithScores.length}...`);
            } catch (error) { console.error(error); }
        }
        toast.dismiss(); toast.success(`${studentsWithScores.length} diplomas downloaded`);
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3"><Award className="text-blue-600" size={28} /><h2 className="text-2xl font-extrabold text-slate-800">{t.title}</h2></div>
                    <button onClick={onClose} disabled={isGenerating} className="p-2 rounded-full hover:bg-slate-100"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div><p className="text-sm text-slate-500">{t.group}</p><p className="font-bold text-slate-800 text-lg">{group.name}</p></div>
                            <div><p className="text-sm text-slate-500">{t.level}</p><p className="font-bold text-slate-800">{group.course}</p></div>
                            <div><p className="text-sm text-slate-500">{t.participantsWithScore}</p><p className="font-bold text-black-600 text-lg">{studentsWithScores.length} / {group.students.length}</p></div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t.searchStudent}</label>
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t.searchPlaceholder} disabled={isGenerating} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50" /></div>
                    </div>
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><User size={18} className="text-blue-600" /> {t.students} ({filteredStudents.length})</h3>
                        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 sticky top-0"><tr><th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.name}</th><th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.username}</th><th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">{t.score}</th><th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">{t.action}</th></tr></thead>
                                <tbody>{filteredStudents.map((student, idx) => (<tr key={student.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx%2===0?'bg-white':'bg-slate-50/30'}`}><td className="px-4 py-3 font-medium text-slate-800">{student.name}</td><td className="px-4 py-3 text-sm text-slate-500">{student.username}</td><td className="px-4 py-3 text-center">{student.score!==null ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black-100 text-black-700 font-bold">{student.score} pts</span> : <span className="text-slate-400 text-sm">{t.noScore}</span>}</td><td className="px-4 py-3 text-center"><button onClick={() => downloadPDF(student)} disabled={student.score===null || isGenerating} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${student.score!==null && !isGenerating ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><FileDown size={14} /> {t.download}</button></td></tr>))}</tbody>
                            </table>
                            {filteredStudents.length===0 && <div className="text-center py-8 text-slate-500">{t.noStudents}</div>}
                        </div>
                    </div>
                    {studentsWithScores.length > 0 && (<div className="flex gap-3 pt-4 border-t border-slate-200"><button onClick={downloadAllDiplomas} disabled={isGenerating} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-800 shadow-md disabled:opacity-50"><Download size={18} /> {isGenerating ? t.generating : t.downloadAll}</button></div>)}
                    {studentsWithScores.length === 0 && (<div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200"><p className="text-sm text-yellow-800 flex items-center gap-2"><FileText size={16} /> {t.warningNoScores}</p></div>)}
                </div>
            </div>
        </div>
    );
};

export default Exportar_diploma_alumno;