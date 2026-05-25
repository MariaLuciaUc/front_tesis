import React, { useState } from 'react';
import { Save, X, Globe, BookOpen, Users, School } from 'lucide-react';
import {toast} from "sonner";

export default function Crear_Grupo({ onGroupCreated, onCancel }) {
    const [groupName, setGroupName] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [language, setLanguage] = useState('español');
    const [selectedCourse, setSelectedCourse] = useState('');

    const courses = ['Super peque', 'Peque', 'Benjamin', 'Cadete', 'Junior', 'Senior'];

    const handleCreate = () => {
        if (!groupName.trim()) {
            toast.info('Por favor ingresa un nombre para el grupo');
            return;
        }
        if (!schoolName.trim()) {
            toast.info('Por favor ingresa el nombre de la escuela');
            return;
        }
        if (!selectedCourse) {
            toast.info('Por favor selecciona un Nivel Bebras');
            return;
        }

        const newGroup = {
            id: Date.now().toString(),
            name: groupName,
            school: schoolName,
            language: language === 'español' ? 'Español' :
                language === 'english' ? 'Inglés' :
                    language === 'frances' ? 'Francés' :
                        language === 'aleman' ? 'Alemán' : 'Portugués',
            course: selectedCourse,
            students: [],
            challengeClosed: false,
        };

        onGroupCreated(newGroup);
        setGroupName('');
        setSchoolName('');
        setLanguage('español');
        setSelectedCourse('');
    };

    const handleCancel = () => {
        setGroupName('');
        setSchoolName('');
        setLanguage('español');
        setSelectedCourse('');
        if (onCancel) onCancel();
    };

    const handleClose = () => {
        if (onCancel) onCancel();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 relative animate-[fadeInUp_.4s_ease-out]">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700 z-10"
                >
                    <X size={20}/>
                </button>

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <Users className="text-blue-600" size={24}/>
                    <h2 className="text-2xl font-extrabold text-slate-800">Nuevo Grupo</h2>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del grupo</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ej: 5to A"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <School size={16} /> Escuela
                    </label>
                    <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ej: Escuela Primaria José Martí"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Globe size={16} /> Idioma
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="español">Español</option>
                        <option value="english">English</option>
                        <option value="frances">Français</option>
                        <option value="aleman">Deutsch</option>
                        <option value="portugues">Português</option>
                    </select>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <BookOpen size={16} /> Nivel Bebras
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {courses.map((course) => (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    selectedCourse === course
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {course}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                    >
                        <Save size={18} /> Crear
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-all"
                    >
                        <X size={18} /> Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}