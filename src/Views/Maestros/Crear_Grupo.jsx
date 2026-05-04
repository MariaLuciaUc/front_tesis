import React, { useState } from 'react';
import './Crear_Grupo.css';

export default function Crear_Grupo({ onGroupCreated }) {
    const [groupName, setGroupName] = useState('');
    const [language, setLanguage] = useState('español');
    const [selectedCourse, setSelectedCourse] = useState('');

    const courses = ['Super peque', 'Peque', 'Benjamin', 'Cadete', 'Junior', 'Senior'];

    const handleCreate = () => {
        // Validaciones
        if (!groupName.trim()) {
            alert('Por favor ingresa un nombre para el grupo');
            return;
        }

        if (!selectedCourse) {
            alert('Por favor selecciona un Nivel Bebras');
            return;
        }

        // Crear objeto del nuevo grupo
        const newGroup = {
            id: Date.now().toString(),
            name: groupName,
            language: language === 'español' ? 'Español' :
                language === 'english' ? 'Inglés' :
                    language === 'frances' ? 'Francés' :
                        language === 'aleman' ? 'Alemán' : 'Portugués',
            course: selectedCourse,
            students: [],
            challengeClosed: false,
        };

        onGroupCreated(newGroup);
    };

    const handleCancel = () => {
        // Limpiar el formulario
        setGroupName('');
        setLanguage('español');
        setSelectedCourse('');
    };

    return (
        <div className="crear-grupo-container">
            <div className="v-create-group">
                <label className="etq-new-group">Nuevo Grupo</label>

                <h3>Nombre del grupo</h3>
                <input
                    type="text"
                    placeholder=""
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <br />

                <label className="etq-new-group">Idioma</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="español">Español</option>
                    <option value="english">English</option>
                    <option value="frances">Français</option>
                    <option value="aleman">Deutsch</option>
                    <option value="portugues">Português</option>
                </select>

                <br />

                <h3>Curso</h3>
                <br />

                <div className="course-buttons">
                    {courses.map((course) => (
                        <button
                            key={course}
                            className={`btn-course ${selectedCourse === course ? 'active' : ''}`}
                            onClick={() => setSelectedCourse(course)}
                            style={selectedCourse === course ? { background: 'rgba(38, 255, 29, 0.4)', transform: 'translateY(-2px)' } : {}}
                        >
                            {course}
                        </button>
                    ))}
                </div>

                <div className="create-and-cancel-group">
                    <button className="btn-create" onClick={handleCreate}> 💾 Crear</button>
                    <button className="btn-cancel" onClick={handleCancel}> ❌ Cancelar</button>
                </div>
            </div>
        </div>
    );
}