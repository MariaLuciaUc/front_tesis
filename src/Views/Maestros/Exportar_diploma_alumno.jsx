import React, { useState } from 'react';
import {X, Search, Download, Trophy, Award, User, FileText, FileDown} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Exportar_diploma_alumno = ({ group, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Filtrar estudiantes por nombre
    const filteredStudents = group.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Estudiantes con puntuación
    const studentsWithScores = group.students.filter(s => s.score !== null && s.score !== undefined);


    // Función para generar el HTML del diploma con colores de Cuba
    const getDiplomaHTML = (student, group) => {


        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Arial', 'Helvetica', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: white;
                    }
                    .diploma {
                        width: 800px;
                        background: white;
                        border: 15px solid #cb1515;
                        border-radius: 20px;
                        padding: 40px;
                        text-align: center;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        position: relative;
                    }
                    .diploma::before {
                        content: '';
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        right: 15px;
                        bottom: 15px;
                        border: 2px solid #002a8f;
                        border-radius: 10px;
                        pointer-events: none;
                    }
                    .header-strip {
                        background: linear-gradient(135deg, #cb1515 0%, #cb1515 33%, #ffffff 33%, #ffffff 66%, #002a8f 66%, #002a8f 100%);
                        height: 60px;
                        width: 100%;
                        margin-bottom: 30px;
                        border-radius: 10px;
                    }
                    .title {
                        font-size: 32px;
                        font-weight: bold;
                        color: #cb1515;
                        letter-spacing: 4px;
                        margin-bottom: 10px;
                    }
                    .subtitle {
                        font-size: 18px;
                        color: #002a8f;
                        margin-bottom: 30px;
                        font-style: italic;
                    }
                    .star {
                        color: #cb1515;
                        font-size: 24px;
                        margin: 20px 0;
                    }
                    .certificate-text {
                        font-size: 18px;
                        color: #333;
                        margin: 20px 0;
                    }
                    .student-name {
                        font-size: 36px;
                        font-weight: bold;
                        color: #002a8f;
                        margin: 20px 0;
                        padding: 15px 30px;
                        background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
                        border-radius: 15px;
                        display: inline-block;
                        border-left: 5px solid #cb1515;
                        border-right: 5px solid #cb1515;
                    }
                    .medal-title {
                        font-size: 22px;
                        font-weight: bold;
                        color: #cb1515;
                        margin: 20px 0;
                        padding: 10px;
                        background: #f0f0f0;
                        border-radius: 10px;
                        display: inline-block;
                    }
                    .score {
                        font-size: 28px;
                        font-weight: bold;
                        color: #002a8f;
                        margin: 20px 0;
                    }
                    .score-number {
                        font-size: 42px;
                        color: #cb1515;
                        font-weight: bold;
                    }
                    .group-info {
                        font-size: 14px;
                        color: #666;
                        margin: 20px 0;
                        line-height: 1.6;
                    }
                    .date {
                        font-size: 12px;
                        color: #999;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                    .signatures {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 40px;
                        padding-top: 20px;
                    }
                    .signature {
                        text-align: center;
                        flex: 1;
                    }
                    .signature-line {
                        width: 80%;
                        border-top: 2px solid #002a8f;
                        margin: 0 auto 10px auto;
                        padding-top: 10px;
                    }
                    .signature-text {
                        font-size: 12px;
                        color: #666;
                    }
                    .cuba-flag-decoration {
                        display: flex;
                        justify-content: center;
                        gap: 5px;
                        margin: 20px 0;
                    }
                    .flag-stripe {
                        width: 30px;
                        height: 20px;
                    }
                    .stripe-red { background-color: #cb1515; }
                    .stripe-white { background-color: #ffffff; border: 1px solid #ddd; }
                    .stripe-blue { background-color: #002a8f; }
                </style>
            </head>
            <body>
                <div class="diploma">
                    <div class="header-strip"></div>
                    
                    <div class="cuba-flag-decoration">
                        <div class="flag-stripe stripe-red"></div>
                        <div class="flag-stripe stripe-white"></div>
                        <div class="flag-stripe stripe-blue"></div>
                        <div class="flag-stripe stripe-red"></div>
                        <div class="flag-stripe stripe-white"></div>
                        <div class="flag-stripe stripe-blue"></div>
                    </div>
                    
                    <div class="title">Desafío BebrasCuba Edición 2026</div>
                    <div class="subtitle">Certificado Oficial de Participación</div>
                   
                    
                    <div class="certificate-text">Se otorga el presente certificado a:</div>
                    
                    <div class="student-name">${student.name}</div>
                    
                    <div class="score">
                        Puntuación obtenida: <span class="score-number">${student.score}</span> puntos
                    </div>
                    
                    <div class="group-info">
                        <strong>Grupo:</strong> ${group.name}<br>
                        <strong>Nivel Bebras:</strong> ${group.course}
                    </div>
                    
                    <div class="signatures">
                        <div class="signature">
                            <div class="signature-line"></div>
                            <div class="signature-text">Firma del Director</div>
                        </div>
                        <div class="signature">
                            <div class="signature-line"></div>
                            <div class="signature-text">Sello Oficial</div>
                        </div>
                    </div>
                    
                    <div class="date">
                        ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    // Función para descargar PDF de un estudiante
    const downloadPDF = async (student) => {
        if (isGenerating) {
            toast.warning('Espera a que termine la generación actual');
            return;
        }

        setIsGenerating(true);

        try {
            toast.loading(`Generando diploma para ${student.name}...`);

            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.top = '-9999px';
            iframe.style.left = '-9999px';
            iframe.style.width = '800px';
            iframe.style.height = '600px';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(getDiplomaHTML(student, group));
            doc.close();

            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(iframe.contentDocument.body, {
                scale: 3,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                windowWidth: 800,
                windowHeight: iframe.contentDocument.body.scrollHeight
            });

            document.body.removeChild(iframe);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            const fileName = `Diploma_${student.name.replace(/\s/g, '_')}.pdf`;
            pdf.save(fileName);

            toast.dismiss();
            toast.success(`Diploma descargado: ${student.name}`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            toast.dismiss();
            toast.error('Error al generar el PDF: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadAllDiplomas = async () => {
        if (isGenerating) {
            toast.warning('Espera a que termine la generación actual');
            return;
        }

        setIsGenerating(true);
        toast.loading(`Preparando ${studentsWithScores.length} diplomas...`);

        for (let i = 0; i < studentsWithScores.length; i++) {
            const student = studentsWithScores[i];

            try {
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.top = '-9999px';
                iframe.style.left = '-9999px';
                iframe.style.width = '800px';
                iframe.style.height = '600px';
                document.body.appendChild(iframe);

                const doc = iframe.contentWindow.document;
                doc.open();
                doc.write(getDiplomaHTML(student, group));
                doc.close();

                await new Promise(resolve => setTimeout(resolve, 300));

                const canvas = await html2canvas(iframe.contentDocument.body, {
                    scale: 3,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    windowWidth: 800
                });

                document.body.removeChild(iframe);

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

                const fileName = `Diploma_${student.name.replace(/\s/g, '_')}.pdf`;
                pdf.save(fileName);

                await new Promise(resolve => setTimeout(resolve, 500));

                toast.dismiss();
                toast.loading(`Descargando ${i + 1} de ${studentsWithScores.length}...`);
            } catch (error) {
                console.error(`Error al generar PDF para ${student.name}:`, error);
            }
        }

        toast.dismiss();
        toast.success(`${studentsWithScores.length} diplomas descargados`);
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Award className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-extrabold text-slate-800">Exportar Diplomas</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isGenerating}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Información del grupo */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-500">Grupo</p>
                                <p className="font-bold text-slate-800 text-lg">{group.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Nivel Bebras</p>
                                <p className="font-bold text-slate-800">{group.course}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Participantes con puntuación</p>
                                <p className="font-bold text-black-600 text-lg">{studentsWithScores.length} / {group.students.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Buscar estudiante
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre o usuario..."
                                disabled={isGenerating}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Lista de estudiantes */}
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <User size={18} className="text-blue-600" />
                            Estudiantes ({filteredStudents.length})
                        </h3>
                        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Nombre</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Usuario</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Puntuación</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={student.id} className={`border-b border-slate-100 hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500">{student.username}</td>
                                        <td className="px-4 py-3 text-center">
                                            {student.score !== null ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black-100 text-black-700 font-bold">
                                                        {student.score} pts
                                                    </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Sin puntuación</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => downloadPDF(student)}
                                                disabled={student.score === null || isGenerating}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    student.score !== null && !isGenerating
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <FileDown size={14} />
                                                Descargar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {filteredStudents.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    No se encontraron estudiantes
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción masiva */}
                    {studentsWithScores.length > 0 && (
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={downloadAllDiplomas}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                {isGenerating ? 'Generando...' : 'Descargar todos los diplomas'}
                            </button>
                        </div>
                    )}

                    {/* Mensaje de advertencia */}
                    {studentsWithScores.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-sm text-yellow-800 flex items-center gap-2">
                                <FileText size={16} />
                                No hay puntuaciones publicadas. Primero debe cerrar el desafío y publicar las puntuaciones.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exportar_diploma_alumno;