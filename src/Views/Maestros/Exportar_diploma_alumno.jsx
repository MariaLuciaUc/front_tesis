import React, { useState, useRef } from 'react';
import { X, Search, Printer, Download, Trophy, Award, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Exportar_diploma_alumno = ({ group, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDiplomaPreview, setShowDiplomaPreview] = useState(false);
    const diplomaRef = useRef(null);

    // Filtrar estudiantes por nombre
    const filteredStudents = group.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Estudiantes con puntuación (después de cerrar desafío)
    const studentsWithScores = group.students.filter(s => s.score !== null && s.score !== undefined);

    // Función para imprimir diploma
    const handlePrintDiploma = (student) => {
        setSelectedStudent(student);
        setShowDiplomaPreview(true);
        setTimeout(() => {
            const printContent = diplomaRef.current;
            if (printContent) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Diploma - ${student.name}</title>
                        <meta charset="UTF-8">
                        <script src="https://cdn.tailwindcss.com"><\/script>
                        <style>
                            @media print {
                                body {
                                    background: white;
                                    padding: 0;
                                    margin: 0;
                                }
                                .no-print {
                                    display: none;
                                }
                                @page {
                                    size: A4;
                                    margin: 0;
                                }
                            }
                        </style>
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen p-5">
                        <div class="max-w-3xl w-full mx-auto">
                            ${printContent.innerHTML}
                        </div>
                        <script>
                            window.onload = () => {
                                window.print();
                                setTimeout(() => window.close(), 100);
                            };
                        <\/script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            }
        }, 100);
    };

    const getMedalEmoji = (score) => {
        if (score >= 90) return '🥇';
        if (score >= 75) return '🥈';
        if (score >= 60) return '🥉';
        return '🎓';
    };

    const getMedalText = (score) => {
        if (score >= 90) return 'Excelencia';
        if (score >= 75) return 'Logro Destacado';
        if (score >= 60) return 'Participación Meritoria';
        return 'Participación';
    };

    const getMedalColor = (score) => {
        if (score >= 90) return 'text-yellow-600';
        if (score >= 75) return 'text-gray-500';
        if (score >= 60) return 'text-amber-600';
        return 'text-blue-600';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl animate-[fadeInUp_.4s_ease-out]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Award className="text-yellow-500" size={28} />
                        <h2 className="text-2xl font-extrabold text-slate-800">Exportar Diplomas</h2>
                    </div>
                    <button
                        onClick={onClose}
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
                                <p className="text-sm text-slate-600">Grupo</p>
                                <p className="font-bold text-slate-800 text-lg">{group.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Nivel Bebras</p>
                                <p className="font-bold text-slate-800">{group.course}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Participantes con puntuación</p>
                                <p className="font-bold text-green-600 text-lg">{studentsWithScores.length} / {group.students.length}</p>
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
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                    <tr key={student.id} className={`border-b border-slate-100 hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{student.username}</td>
                                        <td className="px-4 py-3 text-center">
                                            {student.score !== null ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                                                        {student.score} pts
                                                    </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Sin puntuación</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handlePrintDiploma(student)}
                                                disabled={student.score === null}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    student.score !== null
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <Printer size={14} />
                                                Imprimir Diploma
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
                                onClick={() => {
                                    studentsWithScores.forEach((student, idx) => {
                                        setTimeout(() => handlePrintDiploma(student), idx * 500);
                                    });
                                    toast.success(`Imprimiendo ${studentsWithScores.length} diplomas...`);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                            >
                                <Download size={18} />
                                Imprimir todos los diplomas
                            </button>
                        </div>
                    )}

                    {/* Mensaje de advertencia si no hay puntuaciones */}
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

            {/* Diploma oculto para impresión */}
            {selectedStudent && (
                <div ref={diplomaRef} className="fixed top-0 left-0 opacity-0 pointer-events-none" style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
                    <div className="bg-gradient-to-br from-amber-50 to-white border-8 border-double border-amber-600 rounded-2xl p-8 text-center max-w-2xl shadow-2xl">
                        <div className="relative mb-4">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl bg-white px-4 rounded-full">
                                🏆
                            </div>
                        </div>

                        <div className="border-b-2 border-amber-600 pb-4 mb-6 pt-4">
                            <h1 className="text-4xl font-bold text-slate-800 tracking-wider">DESAFÍO BEBRASCUBA</h1>
                            <p className="text-lg text-slate-500 italic">Certificado de Participación</p>
                        </div>

                        <div className="my-6">
                            <div className="text-5xl mb-4">🦫</div>
                        </div>

                        <p className="text-lg text-slate-600">Se otorga el presente certificado a:</p>

                        <div className="text-3xl font-bold text-slate-800 my-6 py-3 px-6 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg inline-block">
                            {selectedStudent.name}
                        </div>

                        <div className={`text-xl font-bold my-4 ${getMedalColor(selectedStudent.score)}`}>
                            {getMedalText(selectedStudent.score)} {getMedalEmoji(selectedStudent.score)}
                        </div>

                        <div className="text-2xl font-bold text-green-600 my-4">
                            Puntuación obtenida: {selectedStudent.score} puntos
                        </div>

                        <div className="text-sm text-slate-500 my-4 space-y-1">
                            <p>Grupo: {group.name}</p>
                            <p>Nivel Bebras: {group.course}</p>
                        </div>

                        <div className="text-sm text-slate-400 mt-6 pt-4 border-t border-slate-200">
                            {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        <div className="flex justify-between mt-8 pt-4">
                            <div className="text-center flex-1">
                                <div className="border-t-2 border-slate-700 w-4/5 mx-auto pt-2"></div>
                                <div className="text-xs text-slate-500 mt-2">Firma del Director</div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="border-t-2 border-slate-700 w-4/5 mx-auto pt-2"></div>
                                <div className="text-xs text-slate-500 mt-2">Sello Oficial</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de vista previa */}
            {showDiplomaPreview && selectedStudent && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowDiplomaPreview(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white p-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Trophy size={18} className="text-yellow-500" />
                                Vista previa del diploma
                            </h3>
                            <button onClick={() => setShowDiplomaPreview(false)} className="p-1 rounded-full hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-gradient-to-br from-amber-50 to-white border-8 border-double border-amber-600 rounded-2xl p-6 text-center">
                                <div className="text-4xl mb-2">🏆</div>
                                <h2 className="text-2xl font-bold text-slate-800">DESAFÍO BEBRAS</h2>
                                <p className="text-sm text-slate-500 italic">Certificado de Participación</p>
                                <div className="text-3xl my-4">🦫</div>
                                <p className="text-sm text-slate-600">Se otorga a:</p>
                                <h3 className="text-xl font-bold text-slate-800 my-3 py-2 px-4 bg-slate-100 rounded-lg">{selectedStudent.name}</h3>
                                <p className={`text-base font-bold ${getMedalColor(selectedStudent.score)}`}>
                                    {getMedalText(selectedStudent.score)} {getMedalEmoji(selectedStudent.score)}
                                </p>
                                <p className="text-lg font-bold text-green-600 my-2">Puntuación: {selectedStudent.score} pts</p>
                                <p className="text-xs text-slate-400 mt-3">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowDiplomaPreview(false);
                                    handlePrintDiploma(selectedStudent);
                                }}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
                            >
                                <Printer size={16} />
                                Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exportar_diploma_alumno;