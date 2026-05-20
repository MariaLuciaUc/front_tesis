import React, { useState } from 'react';
import { X, Play, CheckCircle, RotateCcw, Clock, Users, PinIcon } from 'lucide-react';

const Monitoreo_participantes = ({ group, onUpdateStudentStatus, onClose }) => {
    const [students, setStudents] = useState(group.students);

    const handleStatusChange = (studentId, newStatus) => {
        const updatedStudents = students.map(student => {
            if (student.id === studentId) {
                const now = new Date().toLocaleString();
                const updates = { status: newStatus };
                if (newStatus === 'in_progress' && student.status === 'not_started') updates.startTime = now;
                if (newStatus === 'finished') updates.endTime = now;
                if (newStatus === 'not_started') { updates.startTime = null; updates.endTime = null; }
                return { ...student, ...updates };
            }
            return student;
        });
        setStudents(updatedStudents);
        if (onUpdateStudentStatus) onUpdateStudentStatus(updatedStudents);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'finished': return 'Finalizado';
            case 'in_progress': return 'Comenzó';
            default: return 'No empezado';
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'not_started': return 'in_progress';
            case 'in_progress': return 'finished';
            case 'finished': return 'not_started';
            default: return 'not_started';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'finished': return 'bg-green-100 text-green-700';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getNextStatusIcon = (currentStatus) => {
        switch (currentStatus) {
            case 'not_started': return <Play size={14} />;
            case 'in_progress': return <CheckCircle size={14} />;
            case 'finished': return <RotateCcw size={14} />;
            default: return <Play size={14} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-[fadeInUp_.3s_ease-out]">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        Monitoreo de participantes: {group.name}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><X size={20} className="text-slate-500" /></button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-100 sticky top-0">
                            <tr><th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Estudiante</th><th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Estado</th><th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hora de inicio</th><th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hora de finalización</th></tr>
                            </thead>
                            <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                                    <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusClass(student.status)}`} onClick={() => handleStatusChange(student.id, getNextStatus(student.status))}>
                                                {getStatusText(student.status)}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500 flex items-center gap-1"><Clock size={12} /> {student.startTime || '—'}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500 flex items-center gap-1"><Clock size={12} /> {student.endTime || '—'}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleStatusChange(student.id, getNextStatus(student.status))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-md">
                                            {getNextStatusIcon(student.status)} Cambiar estado
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm font-semibold text-slate-800 mb-2">
                            <PinIcon size={18}/> Nota:</p>
                        <p className="text-sm text-slate-600 mb-2">Haz clic en el estado o en "Cambiar estado" para modificar:</p>
                        <ul className="text-sm text-slate-600 space-y-1 ml-4">
                            <li><span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">No empezado</span> → <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">Comenzó</span> (inicia el reloj)</li>
                            <li><span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">Comenzó</span> → <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Finalizado</span> (cierra el desafío)</li>
                            <li><span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Finalizado</span> → <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">No empezado</span> (abre el desafío nuevamente)</li>
                        </ul>
                         </div>
                </div>
            </div>
        </div>
    );
};

export default Monitoreo_participantes;