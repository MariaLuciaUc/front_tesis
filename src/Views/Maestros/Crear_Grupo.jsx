import React, { useState } from 'react';
import { Save, X, Globe, BookOpen, Users, School } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axios.js';
import { useMockAuth } from '../../hooks/useMockAuth';

const translations = {
    es: {
        title: "Nuevo Grupo",
        groupName: "Nombre del grupo",
        school: "Escuela",
        language: "Idioma",
        course: "Nivel Bebras",
        create: "Crear",
        cancel: "Cancelar",
        groupRequired: "Por favor ingresa un nombre para el grupo",
        schoolRequired: "Por favor ingresa el nombre de la escuela",
        courseRequired: "Por favor selecciona un Nivel Bebras",
        spanish: "Español",
        english: "Inglés",
        portuguese: "Portugués",
        french: "Francés",
        groupCreated: "Grupo creado exitosamente",
        createError: "Error al crear el grupo"
    },
    en: {
        title: "New Group",
        groupName: "Group name",
        school: "School",
        language: "Language",
        course: "Bebras Level",
        create: "Create",
        cancel: "Cancel",
        groupRequired: "Please enter a group name",
        schoolRequired: "Please enter the school name",
        courseRequired: "Please select a Bebras Level",
        spanish: "Spanish",
        english: "English",
        portuguese: "Portuguese",
        french: "French",
        groupCreated: "Group created successfully",
        createError: "Error creating group"
    },
    pt: {
        title: "Novo Grupo",
        groupName: "Nome do grupo",
        school: "Escola",
        language: "Idioma",
        course: "Nivel Bebras",
        create: "Criar",
        cancel: "Cancelar",
        groupRequired: "Por favor, insira um nome para o grupo",
        schoolRequired: "Por favor, insira o nome da escola",
        courseRequired: "Por favor, selecione um Nivel Bebras",
        spanish: "Espanhol",
        english: "Ingles",
        portuguese: "Portugues",
        french: "Frances",
        groupCreated: "Grupo criado com sucesso",
        createError: "Erro ao criar grupo"
    },
    fr: {
        title: "Nouveau Groupe",
        groupName: "Nom du groupe",
        school: "Ecole",
        language: "Langue",
        course: "Niveau Bebras",
        create: "Creer",
        cancel: "Annuler",
        groupRequired: "Veuillez saisir un nom pour le groupe",
        schoolRequired: "Veuillez saisir le nom de l'ecole",
        courseRequired: "Veuillez selectionner un niveau Bebras",
        spanish: "Espagnol",
        english: "Anglais",
        portuguese: "Portugais",
        french: "Francais",
        groupCreated: "Groupe cree avec succes",
        createError: "Erreur lors de la creation du groupe"
    }
};

export default function Crear_Grupo({ onGroupCreated, onCancel, language: propLanguage = 'es' }) {
    const { user } = useMockAuth();

    const [language, setLanguage] = useState(propLanguage);
    const t = translations[language];

    const [groupName, setGroupName] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [lang, setLang] = useState('es');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const courses = ['Super Peque', 'Peque', 'Benjamin', 'Cadete', 'Junior', 'Senior'];

    const handleCreate = async () => {
        // Validaciones
        if (!groupName.trim()) {
            toast.info(t.groupRequired);
            return;
        }
        if (!schoolName.trim()) {
            toast.info(t.schoolRequired);
            return;
        }
        if (!selectedCourse) {
            toast.info(t.courseRequired);
            return;
        }

        setIsCreating(true);

        const teacherId = user?.id;
        if (!teacherId) {
            toast.error('No se pudo identificar al maestro. Inicia sesion nuevamente.');
            setIsCreating(false);
            return;
        }

        const groupData = {
            group_name: groupName.trim(),
            school: schoolName.trim(),
            language: lang,
            category_id: selectedCourse,
            teacher_id: teacherId
        };

        console.log('Enviando datos al servidor:', groupData);

        try {
            const response = await api.post('/groups', groupData);
            console.log('Respuesta del servidor:', response.data);

            // Obtener el nombre del idioma correctamente
            const languageName = {
                'es': t.spanish,
                'en': t.english,
                'pt': t.portuguese,
                'fr': t.french
            }[lang] || t.spanish;

            // Crear el objeto del nuevo grupo
            const newGroup = {
                id: response.data.id ? response.data.id.toString() : Date.now().toString(),
                name: groupName.trim(),
                school: schoolName.trim(),
                language: languageName,
                course: selectedCourse,
                students: [],
                challengeClosed: false,
            };

            // Limpiar el formulario
            setGroupName('');
            setSchoolName('');
            setLang('es');
            setSelectedCourse('');

            // Mostrar SOLO el toast de éxito
            toast.success(t.groupCreated);

            // Cerrar el modal PRIMERO
            if (onCancel) {
                onCancel();
            }

            // Después de cerrar el modal, actualizar la lista de grupos
            // con un pequeño delay para asegurar que el modal se cerró
            setTimeout(() => {
                if (onGroupCreated) {
                    onGroupCreated(newGroup);
                }
            }, 100);

        } catch (error) {
            console.error('Error en la petición:', error);

            // SOLO mostrar toast de error si es un error REAL de creación
            let errorMessage = t.createError;

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data?.message || 'Datos inválidos. Verifica la información.';
                } else if (status === 401) {
                    errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
                } else if (status === 403) {
                    errorMessage = 'No tienes permisos para crear grupos.';
                } else if (status === 409) {
                    errorMessage = 'Ya existe un grupo con ese nombre.';
                } else if (status === 500) {
                    errorMessage = 'Error del servidor. Intenta más tarde.';
                } else {
                    errorMessage = data?.message || `Error ${status}`;
                }
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor.';
            } else {
                errorMessage = error.message || t.createError;
            }

            toast.error(errorMessage);

        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        setGroupName('');
        setSchoolName('');
        setLang('es');
        setSelectedCourse('');
        if (onCancel) onCancel();
    };

    const handleClose = () => {
        if (onCancel) onCancel();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 relative animate-[fadeInUp_.4s_ease-out]">
                <div className="absolute top-4 right-4 flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                        onClick={() => setLanguage('es')}
                    >
                        ES
                    </button>
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                        onClick={() => setLanguage('pt')}
                    >
                        PT
                    </button>
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                        onClick={() => setLanguage('fr')}
                    >
                        FR
                    </button>
                </div>

                <button
                    onClick={handleClose}
                    className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700 z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <Users className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-extrabold text-slate-800">{t.title}</h2>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.groupName}</label>
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
                        <School size={16} /> {t.school}
                    </label>
                    <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Globe size={16} /> {t.language}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setLang('es')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${lang === 'es' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {t.spanish}
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {t.english}
                        </button>
                        <button
                            onClick={() => setLang('pt')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${lang === 'pt' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {t.portuguese}
                        </button>
                        <button
                            onClick={() => setLang('fr')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${lang === 'fr' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {t.french}
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <BookOpen size={16} /> {t.course}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {courses.map((course) => (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCourse === course ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                {course}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} /> {isCreating ? '...' : t.create}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-all"
                    >
                        <X size={18} /> {t.cancel}
                    </button>
                </div>
            </div>
        </div>
    );
}