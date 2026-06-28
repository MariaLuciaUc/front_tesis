import React, { useState } from 'react';
import { X, Play, CheckCircle, RotateCcw, Clock, Users, PinIcon } from 'lucide-react';

const translations = {
    es: {
        title: "Monitoreo de participantes:",
        student: "Estudiante",
        status: "Estado",
        startTime: "Hora de inicio",
        endTime: "Hora de finalización",
        changeStatus: "Cambiar estado",
        note: "Nota:",
        note1: "Haz clic en el estado o en 'Cambiar estado' para modificar:",
        notStarted: "No empezado",
        inProgress: "Comenzó",
        finished: "Finalizado",
        notStartedDesc: "No empezado → Comenzó (inicia el reloj)",
        inProgressDesc: "Comenzó → Finalizado (cierra el desafío)",
        finishedDesc: "Finalizado → No empezado (abre el desafío nuevamente)",
    },
    en: {
        title: "Participant monitoring:",
        student: "Student",
        status: "Status",
        startTime: "Start time",
        endTime: "End time",
        changeStatus: "Change status",
        note: "Note:",
        note1: "Click on the status or 'Change status' to modify:",
        notStarted: "Not started",
        inProgress: "In progress",
        finished: "Finished",
        notStartedDesc: "Not started → In progress (starts the clock)",
        inProgressDesc: "In progress → Finished (closes the challenge)",
        finishedDesc: "Finished → Not started (reopens the challenge)",
    },
    pt: {
        title: "Monitoramento de participantes:",
        student: "Estudante",
        status: "Status",
        startTime: "Hora de início",
        endTime: "Hora de conclusão",
        changeStatus: "Mudar status",
        note: "Nota:",
        note1: "Clique no status ou em 'Mudar status' para modificar:",
        notStarted: "Não iniciado",
        inProgress: "Em andamento",
        finished: "Finalizado",
        notStartedDesc: "Não iniciado → Em andamento (inicia o relógio)",
        inProgressDesc: "Em andamento → Finalizado (encerra o desafio)",
        finishedDesc: "Finalizado → Não iniciado (reabre o desafio)",
    },
    fr: {
        title: "Suivi des participants :",
        student: "Élève",
        status: "Statut",
        startTime: "Heure de début",
        endTime: "Heure de fin",
        changeStatus: "Changer le statut",
        note: "Remarque :",
        note1: "Cliquez sur le statut ou sur 'Changer le statut' pour modifier :",
        notStarted: "Non commencé",
        inProgress: "En cours",
        finished: "Terminé",
        notStartedDesc: "Non commencé → En cours (démarre l'horloge)",
        inProgressDesc: "En cours → Terminé (clôture le défi)",
        finishedDesc: "Terminé → Non commencé (rouvre le défi)",
    }
};

const Monitoreo_participantes = ({ group, onUpdateStudentStatus, onClose, language = 'es' }) => {
    const t = translations[language];
    const [students, setStudents] = useState(group?.students || []);

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
        if (status === 'finished') return t.finished;
        if (status === 'in_progress') return t.inProgress;
        return t.notStarted;
    };

    const getNextStatus = (currentStatus) => {
        if (currentStatus === 'not_started') return 'in_progress';
        if (currentStatus === 'in_progress') return 'finished';
        return 'not_started';
    };

    const getStatusClass = (status) => {
        if (status === 'finished') return 'bg-green-100 text-green-700';
        if (status === 'in_progress') return 'bg-yellow-100 text-yellow-700';
        return 'bg-slate-100 text-slate-600';
    };

    const getNextStatusIcon = (currentStatus) => {
        if (currentStatus === 'not_started') return <Play size={14} />;
        if (currentStatus === 'in_progress') return <CheckCircle size={14} />;
        return <RotateCcw size={14} />;
    };

    if (!students || students.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
                <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Users size={20} className="text-blue-600" /> {t.title} {group?.name || ''}
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={20} /></button>
                    </div>
                    <div className="p-6 text-center text-slate-500">
                        No hay estudiantes en este grupo.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Users size={20} className="text-blue-600" /> {t.title} {group?.name || ''}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-100 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.student}</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.status}</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.startTime}</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.endTime}</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.changeStatus}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {student.full_name || student.name || 'Sin nombre'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusClass(student.status)}`}
                                            onClick={() => handleStatusChange(student.id, getNextStatus(student.status))}
                                        >
                                            {getStatusText(student.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">
                                        {student.startTime || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">
                                        {student.endTime || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleStatusChange(student.id, getNextStatus(student.status))}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-md"
                                        >
                                            {getNextStatusIcon(student.status)} {t.changeStatus}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1"><PinIcon size={18} /> {t.note}</p>
                        <p className="text-sm text-slate-600 mb-2">{t.note1}</p>
                        <ul className="text-sm text-slate-600 space-y-1 ml-4">
                            <li><span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{t.notStarted}</span> → <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">{t.inProgress}</span> ({t.notStartedDesc})</li>
                            <li><span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">{t.inProgress}</span> → <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">{t.finished}</span> ({t.inProgressDesc})</li>
                            <li><span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">{t.finished}</span> → <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{t.notStarted}</span> ({t.finishedDesc})</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Monitoreo_participantes;