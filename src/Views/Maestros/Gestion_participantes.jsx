import React, { useState } from 'react';
import './Gestion_participantes.css';

const Gestion_participantes = ({ group, onUpdateStudentStatus, onClose }) => {
    const [students, setStudents] = useState(group.students);

    const handleStatusChange = (studentId, newStatus) => {
        const updatedStudents = students.map(student => {
            if (student.id === studentId) {
                const now = new Date().toLocaleString();
                const updates = { status: newStatus };

                if (newStatus === 'in_progress' && student.status === 'not_started') {
                    updates.startTime = now;
                }
                if (newStatus === 'finished') {
                    updates.endTime = now;
                }
                if (newStatus === 'not_started') {
                    updates.startTime = null;
                    updates.endTime = null;
                }

                return { ...student, ...updates };
            }
            return student;
        });

        setStudents(updatedStudents);
        if (onUpdateStudentStatus) {
            onUpdateStudentStatus(updatedStudents);
        }
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
            case 'finished': return 'status-finished';
            case 'in_progress': return 'status-in-progress';
            default: return 'status-not-started';
        }
    };

    return (
        <div className="gestion-participantes-overlay">
            <div className="gestion-participantes-modal">
                <div className="modal-header">
                    <h2>Gestionar participantes - {group.name}</h2>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>

                <div className="modal-body">
                    <div className="table-container">
                        <table className="monitor-table">
                            <thead>
                            <tr>
                                <th>Estudiante</th>
                                <th>Estado</th>
                                <th>Hora de inicio</th>
                                <th>Hora de finalización</th>
                                <th>Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map(student => (
                                <tr key={student.id} className={getStatusClass(student.status)}>
                                    <td>{student.name}</td>
                                    <td>
                                            <span
                                                className={`status-clickable ${getStatusClass(student.status)}`}
                                                onClick={() => handleStatusChange(student.id, getNextStatus(student.status))}
                                                title="Haz clic para cambiar estado"
                                            >
                                                {getStatusText(student.status)}
                                            </span>
                                    </td>
                                    <td>{student.startTime || '—'}</td>
                                    <td>{student.endTime || '—'}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-change-status"
                                            onClick={() => handleStatusChange(student.id, getNextStatus(student.status))}
                                        >
                                            Cambiar estado
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="monitor-info">
                        <p><strong>Nota:</strong> Haz clic en el estado o en "Cambiar estado" para modificar:</p>
                        <ul>
                            <li><span className="status-not-started">No empezado</span> → <span className="status-in-progress">Comenzó</span> (inicia el reloj)</li>
                            <li><span className="status-in-progress">Comenzó</span> → <span className="status-finished">Finalizado</span> (cierra el desafío)</li>
                            <li><span className="status-finished">Finalizado</span> → <span className="status-not-started">No empezado</span> (abre el desafío nuevamente)</li>
                        </ul>
                        <p className="warning">⚠️ No cambie los horarios a menos que haya un corte de energía o algún otro motivo por un tiempo prolongado.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gestion_participantes;