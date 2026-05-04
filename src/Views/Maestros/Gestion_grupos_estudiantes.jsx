import React, { useState } from 'react';
import './Gestion_grupos_estudiantes.css';
import Crear_Grupo from './Crear_Grupo';
import Crear_cuentas_alumnos from './Crear_cuentas_alumnos';
import Gestion_participantes from './Gestion_participantes';
import castorcubasi from '/src/castorcubasi.jpg';

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

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    const handleGroupCreated = (newGroup) => {
        setGroups([...groups, { ...newGroup, students: [], challengeClosed: false }]);
        setSelectedGroupId(newGroup.id);
        setShowCreateGroup(false);
    };

    const handleStudentsCreated = (listaNombres, genero, enviarCorreo) => {
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
    };

    const printDiplomas = () => {
        if (!selectedGroup) return;
        if (!selectedGroup.challengeClosed) {
            alert('Primero debe cerrar el desafío y publicar las puntuaciones');
            return;
        }

        const diplomasContent = selectedGroup.students.map(student =>
            `Diploma para: ${student.name}\nPuntuación: ${student.score || 0}\n---\n`
        ).join('\n');

        const blob = new Blob([diplomasContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diplomas_${selectedGroup.name}.pdf`;
        a.click();
        URL.revokeObjectURL(url);

        alert('Diplomas descargados en formato PDF');
    };

    const showRankingTable = () => {
        if (!selectedGroup) return;
        setShowRanking(true);
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
            case 'finished': return <span className="status-badge finished">✓ Finalizado</span>;
            case 'in_progress': return <span className="status-badge in-progress">⟳ En progreso</span>;
            default: return <span className="status-badge not-started">○ No comenzado</span>;
        }
    };

    const handleGestionarParticipantes = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) {
            alert('⚠️ No hay estudiantes en este grupo. Primero debe agregar estudiantes usando el botón "Crear cuentas".');
            return;
        }
        setShowGestionParticipantes(true);
    };

    if (showCreateGroup) {
        return <Crear_Grupo onGroupCreated={handleGroupCreated} />;
    }

    if (showCrearCuentas) {
        return (
            <div className="crear-cuentas-wrapper">
                <Crear_cuentas_alumnos onStudentsCreated={handleStudentsCreated} onCancel={() => setShowCrearCuentas(false)} />
            </div>
        );
    }

    if (showGestionParticipantes) {
        return (
            <Gestion_participantes
                group={selectedGroup}
                onUpdateStudentStatus={handleUpdateStudentStatus}
                onClose={() => setShowGestionParticipantes(false)}
            />
        );
    }

    return (
        <div className="bebras-dashboard">
            <div className="language-selector">
                <button
                    className={language === 'es' ? 'lang-active' : ''}
                    onClick={() => setLanguage('es')}
                >
                    🇪🇸 Español
                </button>
                <button
                    className={language === 'en' ? 'lang-active' : ''}
                    onClick={() => setLanguage('en')}
                >
                    🇬🇧 English
                </button>
            </div>

            <div className="dashboard-header">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
                    <img src={castorcubasi} alt="castorcubasi" className="pic-bebras-cuba"/>
                    <h1>Desafío Bebras</h1>
                </div>
                <p className="subtitle">Vista del Profesor</p>
            </div>

            <div className="groups-section">
                <div className="section-header">
                    <h2>Grupos</h2>
                    <button className="btn-create-group" onClick={() => setShowCreateGroup(true)}>
                        + Crear Grupo
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div className="empty-groups">
                        <p>No hay grupos creados</p>
                        <button className="btn-create-empty" onClick={() => setShowCreateGroup(true)}>
                            Crear primer grupo
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="group-selector">
                            <label>Seleccionar grupo:</label>
                            <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedGroup && (
                            <>
                                <div className="group-info">
                                    <div className="group-details">
                                        <h3>{selectedGroup.name}</h3>
                                        <span className="group-meta">🌐 {selectedGroup.language}</span>
                                        <span className="group-meta">📚 {selectedGroup.course}</span>
                                        <span className="group-meta">👥 {selectedGroup.students.length} estudiantes</span>
                                        {selectedGroup.challengeClosed && (
                                            <span className="group-meta challenge-closed">🔒 Desafío cerrado</span>
                                        )}
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button
                                        className="btn-gestionar"
                                        onClick={handleGestionarParticipantes}
                                    >
                                        📋 Gestionar participantes
                                    </button>
                                    {!selectedGroup.challengeClosed && (
                                        <button className="btn-publish-scores" onClick={publishScores}>
                                            📊 Cierre este desafío y publique las puntuaciones
                                        </button>
                                    )}
                                    {selectedGroup.challengeClosed && (
                                        <>
                                            <button className="btn-diplomas" onClick={printDiplomas}>
                                                🎓 Imprimir diplomas
                                            </button>
                                            <button className="btn-ranking" onClick={showRankingTable}>
                                                🏆 Ver ranking
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="students-section">
                                    <div className="section-header">
                                        <h2>Estudiantes</h2>
                                        <div className="header-buttons">
                                            <button
                                                className="btn-add-student"
                                                onClick={() => setShowCrearCuentas(true)}
                                            >
                                                Crear cuentas
                                            </button>
                                            <button
                                                className="btn-remove-permissions"
                                                onClick={removeAllResearchPermissions}
                                                title="Quitar permiso de investigación a todos (CUBA)"
                                            >
                                                🚫 Quitar todos permisos
                                            </button>
                                        </div>
                                    </div>

                                    <div className="table-container">
                                        <table className="students-table">
                                            <thead>
                                            <tr>
                                                <th>Nombre de usuario</th>
                                                <th>Nombre</th>
                                                <th>Género</th>
                                                <th>Puntuación</th>
                                                <th>Permiso investigación</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedGroup.students.map(student => (
                                                <tr key={student.id}>
                                                    {editingStudentId === student.id ? (
                                                        <>
                                                            <td><input value={editFormData.username} onChange={(e) => setEditFormData({...editFormData, username: e.target.value})} /></td>
                                                            <td><input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} /></td>
                                                            <td>{student.genero || 'No especificado'}</td>
                                                            <td>{student.score !== undefined && student.score !== null ? student.score : '—'}</td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editFormData.researchPermission}
                                                                    onChange={(e) => setEditFormData({...editFormData, researchPermission: e.target.checked})}
                                                                />
                                                            </td>
                                                            <td>{getStatusBadge(student.status)}</td>
                                                            <td className="actions-cell">
                                                                <button className="save-edit" onClick={() => handleSaveEdit(student.id)}>💾 Guardar</button>
                                                                <button className="cancel-edit" onClick={() => setEditingStudentId(null)}>✖ Cancelar</button>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td>{student.username}</td>
                                                            <td>{student.name}</td>
                                                            <td>{student.genero || 'No especificado'}</td>
                                                            <td className="score-cell">
                                                                {student.score !== undefined && student.score !== null ? student.score : '—'}
                                                            </td>
                                                            <td className="permission-cell">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={student.researchPermission}
                                                                    onChange={() => toggleResearchPermission(student.id)}
                                                                />
                                                                <span className="permission-label">
                                                                    {student.researchPermission ? '✅ Sí' : '❌ No'}
                                                                </span>
                                                            </td>
                                                            <td>{getStatusBadge(student.status)}</td>
                                                            <td className="actions-cell">
                                                                <button className="edit-student" onClick={() => handleEditStudent(student)}>✏️ Editar</button>
                                                                <button className="delete-student" onClick={() => handleDeleteStudent(student.id)}>🗑️ Eliminar</button>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                            {selectedGroup.students.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="empty-row">No hay estudiantes. Haz clic en "Crear cuentas"</td>
                                                </tr>
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

            {showRanking && selectedGroup && (
                <div className="ranking-overlay" onClick={() => setShowRanking(false)}>
                    <div className="ranking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ranking-header">
                            <h2>🏆 Ranking - {selectedGroup.name}</h2>
                            <button className="close-ranking" onClick={() => setShowRanking(false)}>✖</button>
                        </div>
                        <div className="ranking-body">
                            <p className="ranking-subtitle">Mismo grupo de edad: {selectedGroup.course}</p>
                            <table className="ranking-table">
                                <thead>
                                <tr>
                                    <th>Posición</th>
                                    <th>Puntuación</th>
                                    <th>Cantidad de estudiantes</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(() => {
                                    const scores = selectedGroup.students
                                        .filter(s => s.score !== null)
                                        .map(s => s.score);
                                    const scoreCounts = {};
                                    scores.forEach(score => {
                                        scoreCounts[score] = (scoreCounts[score] || 0) + 1;
                                    });
                                    const sortedScores = Object.keys(scoreCounts)
                                        .map(Number)
                                        .sort((a, b) => b - a);

                                    return sortedScores.map((score, idx) => (
                                        <tr key={score}>
                                            <td className="rank">{idx + 1}</td>
                                            <td className="score">{score}</td>
                                            <td className="count">{scoreCounts[score]} estudiante(s)</td>
                                        </tr>
                                    ));
                                })()}
                                {selectedGroup.students.filter(s => s.score !== null).length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="empty-ranking">No hay puntuaciones disponibles</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div className="teacher-description">
                <h3>¡Bienvenidos al Desafío Bebras!</h3>
                <p>Ahora está ubicado en la vista del maestro donde puede crear y administrar grupos, crear y modificar cuentas de estudiantes y ver los resultados del desafío. También podrá imprimir los certificados de los estudiantes después del desafío.</p>
                <p>Hay un menú desplegable aquí en la parte superior de la página. Allí podrá seleccionar el grupo que desea ver y administrar. Desde allí también puede agregar nuevos grupos.</p>
                <p>Desplácese hacia abajo un boton para crear la cuenta de cada uno de los estudiantes por grupo.</p>
                <p>Durante el desafío, puedes ver el estado de los estudiantes y las marcas de tiempo para iniciar y cerrar el desafío con el botón Gestionar los estudiantes.</p>
                <p>Una vez que finalice todo el grupo, puede hacer clic en el botón Cerrar este desafío y publicar las puntuaciones.</p>
                <p className="important-note"><strong>⚠️ IMPORTANTE (CUBA):</strong> Debe quitar la marca de verificación del permiso de investigación a TODOS los estudiantes usando el botón "Quitar todos permisos".</p>
            </div>
        </div>
    );
};

export default Gestion_grupos_estudiantes;