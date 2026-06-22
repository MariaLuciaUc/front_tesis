import React, { useState } from 'react';
import { X, UserPlus, Send, Trash2, Users, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axios.js';

const translations = {
    es: {
        title: "Crear cuentas nuevas",
        important: "IMPORTANTE:",
        importantText: "Escriba correctamente el nombre de los estudiantes del grupo. Este nombre es el que aparecerá en el certificado de participación.",
        nameLabel: "Ingrese los nombres (uno por línea):",
        namePlaceholder: "Ejemplo:\nAna García\nMaría López\nCarmen Rodríguez",
        genderLabel: "Género:",
        female: "Femenino",
        male: "Masculino",
        emailCheckbox: "Enviar nuevas cuentas al correo electrónico dgalvezlio@outlook.com",
        saveButton: "Guardar y Agregar Estudiantes",
        clearButton: "Limpiar todo",
        noNames: "Por favor, ingrese al menos un nombre",
        studentsAdded: " estudiante(s) agregado(s) correctamente",
        close: "Cerrar",
        creating: "Creando estudiantes...",
        errorCreating: "Error al crear los estudiantes"
    },
    en: {
        title: "Create new accounts",
        important: "IMPORTANT:",
        importantText: "Write the students' names correctly. This name will appear on the participation certificate.",
        nameLabel: "Enter names (one per line):",
        namePlaceholder: "Example:\nAna García\nMaría López\nCarmen Rodríguez",
        genderLabel: "Gender:",
        female: "Female",
        male: "Male",
        emailCheckbox: "Send new accounts to dgalvezlio@outlook.com",
        saveButton: "Save and Add Students",
        clearButton: "Clear all",
        noNames: "Please enter at least one name",
        studentsAdded: " student(s) added successfully",
        close: "Close",
        creating: "Creating students...",
        errorCreating: "Error creating students"
    },
    pt: {
        title: "Criar novas contas",
        important: "IMPORTANTE:",
        importantText: "Escreva corretamente o nome dos alunos. Este nome aparecerá no certificado de participação.",
        nameLabel: "Digite os nomes (um por linha):",
        namePlaceholder: "Exemplo:\nAna García\nMaría López\nCarmen Rodríguez",
        genderLabel: "Gênero:",
        female: "Feminino",
        male: "Masculino",
        emailCheckbox: "Enviar novas contas para dgalvezlio@outlook.com",
        saveButton: "Salvar e Adicionar Alunos",
        clearButton: "Limpar tudo",
        noNames: "Por favor, insira pelo menos um nome",
        studentsAdded: " aluno(s) adicionado(s) com sucesso",
        close: "Fechar",
        creating: "Criando estudantes...",
        errorCreating: "Erro ao criar estudantes"
    },
    fr: {
        title: "Créer de nouveaux comptes",
        important: "IMPORTANT :",
        importantText: "Écrivez correctement le nom des élèves. Ce nom apparaîtra sur le certificat de participation.",
        nameLabel: "Saisissez les noms (un par ligne) :",
        namePlaceholder: "Exemple :\nAna García\nMaría López\nCarmen Rodríguez",
        genderLabel: "Genre :",
        female: "Féminin",
        male: "Masculin",
        emailCheckbox: "Envoyer les nouveaux comptes à dgalvezlio@outlook.com",
        saveButton: "Enregistrer et ajouter les élèves",
        clearButton: "Tout effacer",
        noNames: "Veuillez saisir au moins un nom",
        studentsAdded: " élève(s) ajouté(s) avec succès",
        close: "Fermer",
        creating: "Création des étudiants...",
        errorCreating: "Erreur lors de la création des étudiants"
    }
};

export default function Crear_cuentas_alumnos({ onStudentsCreated, onCancel, groupId, categoryId, teacherId, language: propLanguage = 'es' }) {
    const [language, setLanguage] = useState(propLanguage);
    const t = translations[language];

    const [nombres, setNombres] = useState('');
    const [genero, setGenero] = useState('Femenino');
    const [enviarCorreo, setEnviarCorreo] = useState(false);
    const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
    const [listaNombres, setListaNombres] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const guardarYEnviar = async () => {
        const nombresArray = nombres
            .split('\n')
            .map(nombre => nombre.trim())
            .filter(nombre => nombre !== '');

        if (nombresArray.length === 0) {
            toast.error(t.noNames);
            return;
        }

        setIsCreating(true);
        setListaNombres(nombresArray);

        const estudiantesData = {
            teacher_id: teacherId,
            category_id: categoryId,
            group_id: groupId,
            students: nombresArray,
            gender: genero // 👈 ENVIAR 'M' o 'F' al backend
        };

        try {
            const response = await api.post('/students/bulk', estudiantesData);
            console.log('RESPUESTA DEL BACKEND:', response.data);

            // Crear manualmente los estudiantes con contraseñas generadas en frontend
            const estudiantesCreados = nombresArray.map((nombre, index) => {
                // Generar una contraseña simple
                const palabras = ['casa', 'gato', 'luna', 'flor', 'mano', 'pies', 'boca', 'tren'];
                const simbolos = ['@', '#', '$', '%', '&'];
                const palabra = palabras[Math.floor(Math.random() * palabras.length)];
                const numeros = Math.floor(Math.random() * 900 + 100);
                const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
                const passwordGenerada = palabra + numeros + simbolo;

                return {
                    id: response.data.data?.[index]?.id || Date.now() + index,
                    full_name: nombre,
                    gender: genero, // 👈 GUARDAR GÉNERO
                    username: response.data.data?.[index]?.username || `usr${categoryId}${String(index + 1).padStart(4, '0')}`,
                    generated_password: passwordGenerada
                };
            });

            console.log('Estudiantes con contraseñas generadas:', estudiantesCreados);

            setMostrarVistaPrevia(true);
            toast.success(`${estudiantesCreados.length} ${t.studentsAdded}`);

            if (onStudentsCreated) {
                onStudentsCreated(estudiantesCreados, genero, enviarCorreo);
            }

            setNombres('');
        } catch (error) {
            console.error('Error al crear estudiantes:', error);
            const errorMessage = error.response?.data?.message || t.errorCreating;
            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const limpiarTodo = () => {
        setNombres('');
        setListaNombres([]);
        setMostrarVistaPrevia(false);
    };

    const cerrarModal = () => {
        limpiarTodo();
        if (onCancel) onCancel();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative animate-[fadeInUp_.4s_ease-out]">
                <div className="absolute top-4 right-4 flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('es')}>ES</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('en')}>EN</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('pt')}>PT</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('fr')}>FR</button>
                </div>

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <UserPlus className="text-blue-600" size={24} />
                        <h2 className="text-2xl font-extrabold text-slate-800">{t.title}</h2>
                    </div>
                    <button onClick={cerrarModal} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl mt-3 flex items-center gap-2">
                    <AlertTriangle size={60} className="text-red-500" />
                    <span><strong>{t.important}</strong> {t.importantText}</span>
                </p>

                <div className="mb-6 mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.nameLabel}</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-sans"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        placeholder={t.namePlaceholder}
                        rows={6}
                        disabled={isCreating}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.genderLabel}</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setGenero('Femenino')}
                            className={`px-6 py-2 rounded-xl font-medium transition-all ${genero === 'Femenino' ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            disabled={isCreating}
                        >
                            {t.female} ♀
                        </button>
                        <button
                            type="button"
                            onClick={() => setGenero('Masculino')}
                            className={`px-6 py-2 rounded-xl font-medium transition-all ${genero === 'Masculino' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            disabled={isCreating}
                        >
                            {t.male} ♂
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                    <button onClick={guardarYEnviar} disabled={isCreating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send size={18}/> {isCreating ? t.creating : t.saveButton}
                    </button>
                    <button onClick={limpiarTodo} disabled={isCreating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 size={18} /> {t.clearButton}
                    </button>
                </div>

                {mostrarVistaPrevia && listaNombres.length > 0 && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Users size={18} className="text-blue-600" /> Estudiantes agregados ({listaNombres.length}):
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                            {listaNombres.map((nombre, index) => (
                                <div key={index} className="text-sm text-slate-600 py-1 px-2 bg-white rounded border border-slate-100 flex items-center gap-1">
                                    {genero === 'F' ? '♀' : '♂'} {index + 1}. {nombre}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}