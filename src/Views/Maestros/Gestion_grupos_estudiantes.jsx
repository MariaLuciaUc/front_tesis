// src/Views/Maestro/Gestion_grupos_estudiantes.jsx
import React, { useState, useEffect } from 'react';
import Crear_Grupo from './Crear_Grupo';
import Crear_cuentas_alumnos from './Crear_cuentas_alumnos';
import Monitoreo_participantes from './Monitoreo_participantes.jsx';
import Exportar_diploma_alumno from './Exportar_diploma_alumno';
import castorcubasi from '/src/castorcubasi.jpg';
import { Users, Plus, Globe, BookOpen, Lock, X, Trash2, Save, CheckCircle, UserPlus, Clock, BarChart3, AlertCircle, Play, Download, FileDown, FileText, FileSpreadsheet, Edit, Key, LogOut } from 'lucide-react';
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../api/axios.js';
import { useMockAuth } from '../../hooks/useMockAuth';

const translations = {
    es: {
        logout: "Cerrar sesion",
        title: "Desafio BebrasCuba",
        subtitle: "Vista del Profesor",
        groups: "Grupos",
        createGroup: "Crear Grupo",
        noGroups: "No hay grupos creados",
        createFirstGroup: "Crear primer grupo",
        selectGroup: "Seleccionar grupo:",
        editGroup: "Editar grupo",
        deleteGroup: "Eliminar grupo",
        students: "Estudiantes",
        createAccounts: "Crear cuentas",
        monitorParticipants: "Monitorear participantes",
        closeChallenge: "Cerrar desafio y mostrar puntuaciones",
        exportDiplomas: "Exportar diplomas de participacion de estudiantes",
        exportReport: "Exportar reporte de participacion de grupo",
        exportCredentials: "Exportar credenciales de los alumnos",
        welcomeTitle: "Bienvenidos al Desafio Bebras",
        welcomeText1: "Ahora esta ubicado en la vista del maestro donde puede crear y administrar grupos, crear y modificar cuentas de estudiantes y ver los resultados del desafio. Tambien podra imprimir los certificados de los estudiantes despues del desafio.",
        welcomeText2: "Hay un menu desplegable aqui en la parte superior de la pagina. Alli podra seleccionar el grupo que desea ver y administrar. Desde alli tambien puede agregar nuevos grupos.",
        welcomeText3: "Desplacese hacia abajo un boton para crear la cuenta de cada uno de los estudiantes por grupo.",
        welcomeText4: "Durante el desafio, puedes ver el estado de los estudiantes y las marcas de tiempo para iniciar y cerrar el desafio con el boton Gestionar los estudiantes.",
        welcomeText5: "Una vez que finalice todo el grupo, puede hacer clic en el boton Cerrar este desafio y publicar las puntuaciones.",
        editGroupModalTitle: "Editar Grupo",
        groupNameRequired: "El nombre del grupo es obligatorio",
        groupUpdated: "Grupo actualizado exitosamente",
        deleteGroupConfirm: "Estas seguro de que deseas eliminar este grupo? Se perderan todos los estudiantes y datos asociados.",
        groupDeleted: "Grupo eliminado exitosamente",
        noStudentsWarning: "No hay estudiantes inscritos en este grupo",
        publishConfirm: "Cerrar este desafio y publicar las puntuaciones? Los estudiantes no podran cambiar sus respuestas.",
        noStudentsExport: "No hay estudiantes en este grupo",
        exportFormat: "Exportar Reporte",
        selectFormat: "Seleccione el formato en el que desea exportar el reporte de participacion del grupo.",
        excel: "Excel (.xlsx)",
        pdf: "PDF (.pdf)",
        cancel: "Cancelar",
        reportGenerated: "Reporte exportado exitosamente en formato",
        errorExport: "Error al exportar",
        student: "Estudiante",
        username: "Usuario",
        score: "Puntuacion",
        status: "Estado",
        actions: "Acciones",
        save: "Guardar",
        edit: "Editar",
        delete: "Eliminar",
        finished: "Finalizado",
        inProgress: "En progreso",
        notStarted: "No comenzado",
        school: "Escuela",
        language: "Idioma",
        level: "Nivel",
        studentsCount: "estudiantes",
        challengeClosedLabel: "Desafio cerrado",
        noStudentsTable: "No hay estudiantes. Haz clic en Crear cuentas",
        summaryReport: "Resumen del Grupo",
        totalStudents: "Total de estudiantes",
        totalFinished: "Total Finalizados",
        totalInProgress: "Total En Progreso",
        totalNotStarted: "Total No Comenzados",
        averageScore: "Puntuacion Promedio",
        highestScore: "Puntuacion Mas Alta",
        lowestScore: "Puntuacion Mas Baja",
        completionRate: "Tasa de Finalizacion",
        notSpecified: "No especificado",
        noSchool: "Escuela no especificada",
        teacherMessageTitle: "Mensaje al profesor",
        defaultTeacherMessage: "Bienvenidos al Desafio Bebras Cuba 2026. Aqui podran gestionar sus grupos y estudiantes.",
        studentUpdated: "Estudiante actualizado exitosamente",
        updateError: "Error al actualizar el estudiante",
        nameRequired: "El nombre del estudiante es obligatorio",
        scoresPublished: "Puntuaciones publicadas exitosamente",
        credentialsExported: "Credenciales exportadas exitosamente"
    },
    en: {
        logout: "Logout",
        title: "BebrasCuba Challenge",
        subtitle: "Teacher View",
        groups: "Groups",
        createGroup: "Create Group",
        noGroups: "No groups created",
        createFirstGroup: "Create first group",
        selectGroup: "Select group:",
        editGroup: "Edit group",
        deleteGroup: "Delete group",
        students: "Students",
        createAccounts: "Create accounts",
        monitorParticipants: "Monitor participants",
        closeChallenge: "Close challenge and show scores",
        exportDiplomas: "Export student participation diplomas",
        exportReport: "Export group participation report",
        exportCredentials: "Export student credentials",
        welcomeTitle: "Welcome to the Bebras Challenge",
        welcomeText1: "You are now in the teacher view where you can create and manage groups, create and modify student accounts, and view challenge results. You can also print student certificates after the challenge.",
        welcomeText2: "There is a dropdown menu at the top of the page. There you can select the group you want to view and manage. From there you can also add new groups.",
        welcomeText3: "Scroll down to a button to create an account for each student per group.",
        welcomeText4: "During the challenge, you can see the status of students and timestamps to start and close the challenge with the Manage Students button.",
        welcomeText5: "Once the entire group has finished, you can click the Close this challenge and publish scores button.",
        editGroupModalTitle: "Edit Group",
        groupNameRequired: "Group name is required",
        groupUpdated: "Group updated successfully",
        deleteGroupConfirm: "Are you sure you want to delete this group? All students and associated data will be lost.",
        groupDeleted: "Group deleted successfully",
        noStudentsWarning: "There are no students enrolled in this group",
        publishConfirm: "Close this challenge and publish scores? Students will not be able to change their answers.",
        noStudentsExport: "There are no students in this group",
        exportFormat: "Export Report",
        selectFormat: "Select the format in which you want to export the group participation report.",
        excel: "Excel (.xlsx)",
        pdf: "PDF (.pdf)",
        cancel: "Cancel",
        reportGenerated: "Report successfully exported in",
        errorExport: "Error exporting",
        student: "Student",
        username: "Username",
        score: "Score",
        status: "Status",
        actions: "Actions",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        finished: "Finished",
        inProgress: "In progress",
        notStarted: "Not started",
        school: "School",
        language: "Language",
        level: "Level",
        studentsCount: "students",
        challengeClosedLabel: "Challenge closed",
        noStudentsTable: "No students. Click on Create accounts",
        summaryReport: "Group Summary",
        totalStudents: "Total students",
        totalFinished: "Total Finished",
        totalInProgress: "Total In Progress",
        totalNotStarted: "Total Not Started",
        averageScore: "Average Score",
        highestScore: "Highest Score",
        lowestScore: "Lowest Score",
        completionRate: "Completion Rate",
        notSpecified: "Not specified",
        noSchool: "School not specified",
        teacherMessageTitle: "Teacher's message",
        defaultTeacherMessage: "Welcome to the Bebras Cuba 2026 Challenge. Here you can manage your groups and students.",
        studentUpdated: "Student updated successfully",
        updateError: "Error updating student",
        nameRequired: "Student name is required",
        scoresPublished: "Scores published successfully",
        credentialsExported: "Credentials exported successfully"
    },
    pt: {
        logout: "Sair",
        title: "Desafio BebrasCuba",
        subtitle: "Visao do Professor",
        groups: "Grupos",
        createGroup: "Criar Grupo",
        noGroups: "Nenhum grupo criado",
        createFirstGroup: "Criar primeiro grupo",
        selectGroup: "Selecionar grupo:",
        editGroup: "Editar grupo",
        deleteGroup: "Excluir grupo",
        students: "Estudantes",
        createAccounts: "Criar contas",
        monitorParticipants: "Monitorar participantes",
        closeChallenge: "Encerrar desafio e mostrar pontuacoes",
        exportDiplomas: "Exportar diplomas de participacao dos estudantes",
        exportReport: "Exportar relatorio de participacao do grupo",
        exportCredentials: "Exportar credenciais dos alunos",
        welcomeTitle: "Bem-vindo ao Desafio Bebras",
        welcomeText1: "Agora voce esta na visao do professor, onde pode criar e gerenciar grupos, criar e modificar contas de alunos e ver os resultados do desafio. Voce tambem pode imprimir os certificados dos alunos apos o desafio.",
        welcomeText2: "Ha um menu suspenso no topo da pagina. La voce pode selecionar o grupo que deseja visualizar e gerenciar. A partir dai, voce tambem pode adicionar novos grupos.",
        welcomeText3: "Role para baixo para um botao que cria uma conta para cada aluno por grupo.",
        welcomeText4: "Durante o desafio, voce pode ver o status dos alunos e os horarios de inicio e fim com o botao Gerenciar alunos.",
        welcomeText5: "Depois que todo o grupo terminar, voce pode clicar no botao Encerrar este desafio e publicar as pontuacoes.",
        editGroupModalTitle: "Editar Grupo",
        groupNameRequired: "O nome do grupo e obrigatorio",
        groupUpdated: "Grupo atualizado com sucesso",
        deleteGroupConfirm: "Tem certeza de que deseja excluir este grupo? Todos os alunos e dados associados serao perdidos.",
        groupDeleted: "Grupo excluido com sucesso",
        noStudentsWarning: "Nao ha alunos matriculados neste grupo",
        publishConfirm: "Encerrar este desafio e publicar as pontuacoes? Os alunos nao poderao alterar suas respostas.",
        noStudentsExport: "Nao ha alunos neste grupo",
        exportFormat: "Exportar Relatorio",
        selectFormat: "Selecione o formato no qual deseja exportar o relatorio de participacao do grupo.",
        excel: "Excel (.xlsx)",
        pdf: "PDF (.pdf)",
        cancel: "Cancelar",
        reportGenerated: "Relatorio exportado com sucesso em",
        errorExport: "Erro ao exportar",
        student: "Estudante",
        username: "Usuario",
        score: "Pontuacao",
        status: "Status",
        actions: "Acoes",
        save: "Salvar",
        edit: "Editar",
        delete: "Excluir",
        finished: "Finalizado",
        inProgress: "Em andamento",
        notStarted: "Nao iniciado",
        school: "Escola",
        language: "Idioma",
        level: "Nivel",
        studentsCount: "estudantes",
        challengeClosedLabel: "Desafio encerrado",
        noStudentsTable: "Nenhum aluno. Clique em Criar contas",
        summaryReport: "Resumo do Grupo",
        totalStudents: "Total de alunos",
        totalFinished: "Total Finalizados",
        totalInProgress: "Total Em Andamento",
        totalNotStarted: "Total Nao Iniciados",
        averageScore: "Pontuacao Media",
        highestScore: "Maior Pontuacao",
        lowestScore: "Menor Pontuacao",
        completionRate: "Taxa de Conclusao",
        notSpecified: "Nao especificado",
        noSchool: "Escola nao especificada",
        teacherMessageTitle: "Mensagem do professor",
        defaultTeacherMessage: "Bem-vindos ao Desafio Bebras Cuba 2026. Aqui voce pode gerenciar seus grupos e alunos.",
        studentUpdated: "Estudante atualizado com sucesso",
        updateError: "Erro ao atualizar estudante",
        nameRequired: "O nome do estudante e obrigatorio",
        scoresPublished: "Pontuacoes publicadas com sucesso",
        credentialsExported: "Credenciais exportadas com sucesso"
    },
    fr: {
        logout: "Deconnexion",
        title: "Defi BebrasCuba",
        subtitle: "Vue Enseignant",
        groups: "Groupes",
        createGroup: "Creer un groupe",
        noGroups: "Aucun groupe cree",
        createFirstGroup: "Creer le premier groupe",
        selectGroup: "Selectionner un groupe :",
        editGroup: "Modifier le groupe",
        deleteGroup: "Supprimer le groupe",
        students: "Eleves",
        createAccounts: "Creer des comptes",
        monitorParticipants: "Suivre les participants",
        closeChallenge: "Cloturer le defi et montrer les scores",
        exportDiplomas: "Exporter les diplomes de participation des eleves",
        exportReport: "Exporter le rapport de participation du groupe",
        exportCredentials: "Exporter les identifiants des eleves",
        welcomeTitle: "Bienvenue au Defi Bebras",
        welcomeText1: "Vous etes maintenant dans la vue enseignant ou vous pouvez creer et gerer des groupes, creer et modifier des comptes d'eleves et voir les resultats du defi. Vous pouvez egalement imprimer les certificats des eleves apres le defi.",
        welcomeText2: "Il y a un menu deroulant en haut de la page. Vous pouvez y selectionner le groupe que vous souhaitez voir et gerer. A partir de la, vous pouvez egalement ajouter de nouveaux groupes.",
        welcomeText3: "Faites defiler vers le bas pour un bouton qui cree un compte pour chaque eleve par groupe.",
        welcomeText4: "Pendant le defi, vous pouvez voir l'etat des eleves et les horodatages pour demarrer et cloturer le defi avec le bouton Gerer les eleves.",
        welcomeText5: "Une fois que tout le groupe a termine, vous pouvez cliquer sur le bouton Cloturer ce defi et publier les scores.",
        editGroupModalTitle: "Modifier le groupe",
        groupNameRequired: "Le nom du groupe est obligatoire",
        groupUpdated: "Groupe mis a jour avec succes",
        deleteGroupConfirm: "Etes-vous sur de vouloir supprimer ce groupe ? Tous les eleves et les donnees associees seront perdus.",
        groupDeleted: "Groupe supprime avec succes",
        noStudentsWarning: "Aucun eleve inscrit dans ce groupe",
        publishConfirm: "Cloturer ce defi et publier les scores ? Les eleves ne pourront pas modifier leurs reponses.",
        noStudentsExport: "Aucun eleve dans ce groupe",
        exportFormat: "Exporter le rapport",
        selectFormat: "Selectionnez le format dans lequel vous souhaitez exporter le rapport de participation du groupe.",
        excel: "Excel (.xlsx)",
        pdf: "PDF (.pdf)",
        cancel: "Annuler",
        reportGenerated: "Rapport exporte avec succes en",
        errorExport: "Erreur lors de l'exportation",
        student: "Eleve",
        username: "Nom d'utilisateur",
        score: "Score",
        status: "Statut",
        actions: "Actions",
        save: "Enregistrer",
        edit: "Modifier",
        delete: "Supprimer",
        finished: "Termine",
        inProgress: "En cours",
        notStarted: "Non commence",
        school: "Ecole",
        language: "Langue",
        level: "Niveau",
        studentsCount: "eleves",
        challengeClosedLabel: "Defi cloture",
        noStudentsTable: "Aucun eleve. Cliquez sur Creer des comptes",
        summaryReport: "Resume du groupe",
        totalStudents: "Total d'eleves",
        totalFinished: "Total Termines",
        totalInProgress: "Total En cours",
        totalNotStarted: "Total Non commences",
        averageScore: "Score moyen",
        highestScore: "Score le plus eleve",
        lowestScore: "Score le plus bas",
        completionRate: "Taux d'achevement",
        notSpecified: "Non specifie",
        noSchool: "Ecole non specifiee",
        teacherMessageTitle: "Message de l'enseignant",
        defaultTeacherMessage: "Bienvenue au Defi Bebras Cuba 2026. Vous pouvez ici gerer vos groupes et vos eleves.",
        studentUpdated: "Etudiant mis a jour avec succes",
        updateError: "Erreur lors de la mise a jour",
        nameRequired: "Le nom de l'etudiant est requis",
        scoresPublished: "Scores publies avec succes",
        credentialsExported: "Identifiants exportes avec succes"
    }
};

const Gestion_grupos_estudiantes = () => {
    const { user, isTeacher } = useMockAuth();

    const [language, setLanguage] = useState('es');
    const t = translations[language];

    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCrearCuentas, setShowCrearCuentas] = useState(false);
    const [showGestionParticipantes, setShowGestionParticipantes] = useState(false);
    const [showExportDiplomas, setShowExportDiplomas] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [teacherWelcomeMessage, setTeacherWelcomeMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [allCredentials, setAllCredentials] = useState({});

    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        full_name: '',
        username: '',
        gender: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const teacherId = user?.id;
    const teacherName = user?.full_name;
    const teacherEmail = user?.email;

    const loadGroups = async () => {
        if (!teacherId) {
            console.warn('No hay teacher_id disponible');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`/groups?teacher_id=${teacherId}`);

            const groupsData = Array.isArray(response.data) ? response.data :
                (response.data.data ? response.data.data : []);

            const formattedGroups = groupsData.map(group => ({
                id: group.id.toString(),
                name: group.group_name,
                school: group.school || '',
                language: group.language === 'es' ? 'Espanol' : group.language === 'en' ? 'English' : group.language === 'pt' ? 'Portugues' : 'Frances',
                languageCode: group.language,
                course: (() => {
                    const categoryMap = { 1: 'Super Peque', 2: 'Peque', 3: 'Benjamin', 4: 'Cadete', 5: 'Junior', 6: 'Senior' };
                    return categoryMap[group.category_id] || 'Super Peque';
                })(),
                students: [],
                challengeClosed: false
            }));

            setGroups(formattedGroups);

            if (formattedGroups.length > 0) {
                setSelectedGroupId(formattedGroups[0].id);
            } else {
                setSelectedGroupId('');
            }
        } catch (error) {
            console.error('Error al cargar grupos:', error);
            toast.error('Error al cargar los grupos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (teacherId) {
            loadGroups();
        }
    }, [teacherId]);

    useEffect(() => {
        const loadGroupStudents = async () => {
            if (!selectedGroupId) return;
            try {
                const response = await api.get(`/groups/${selectedGroupId}/students`);
                if (response.data && response.data.students) {
                    setGroups(prevGroups => prevGroups.map(group =>
                        group.id === selectedGroupId
                            ? { ...group, students: response.data.students }
                            : group
                    ));
                    const savedCredentials = localStorage.getItem(`credentials_group_${selectedGroupId}`);
                    if (savedCredentials) {
                        const parsed = JSON.parse(savedCredentials);
                        const currentUsernames = new Set(
                            response.data.students.map(s => s.username)
                        );
                        const pruned = Object.fromEntries(
                            Object.entries(parsed).filter(([username]) => currentUsernames.has(username))
                        );
                        setAllCredentials(pruned);
                        localStorage.setItem(`credentials_group_${selectedGroupId}`, JSON.stringify(pruned));
                    }
                }
            } catch (error) {
                console.error('Error al cargar estudiantes:', error);
            }
        };
        loadGroupStudents();
    }, [selectedGroupId]);

    useEffect(() => {
        const savedConfig = localStorage.getItem('bebrasContestConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            if (config.welcomeMessageTeacher) {
                setTeacherWelcomeMessage(config.welcomeMessageTeacher);
            } else {
                setTeacherWelcomeMessage(t.defaultTeacherMessage);
            }
        } else {
            setTeacherWelcomeMessage(t.defaultTeacherMessage);
        }
    }, [t.defaultTeacherMessage]);

    if (!isTeacher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-red-600">Acceso Denegado</h2>
                    <p className="text-gray-600 mt-2">No tienes permisos para ver este panel.</p>
                </div>
            </div>
        );
    }

    const handleGroupCreated = async (newGroup) => {
        try {
            const groupData = {
                ...newGroup,
                teacher_id: teacherId
            };

            const response = await api.post('/groups', groupData);

            await loadGroups();

            if (response.data && response.data.id) {
                setSelectedGroupId(response.data.id.toString());
            }

            setShowCreateGroup(false);
            toast.success('Grupo creado exitosamente');

        } catch (error) {
            console.error('Error al crear grupo:', error);
            const errorMessage = error.response?.data?.message || 'Error al crear el grupo';
            toast.error(errorMessage);
        }
    };

    const handleDeleteGroup = async () => {

        if (!selectedGroup) {
            toast.error('No hay un grupo seleccionado');
            return;
        }


        let canDelete = true;

        try {
            const studentsResponse = await api.get(`/groups/${selectedGroupId}/students`);

            const studentsCount = studentsResponse.data?.students?.length || 0;

            if (studentsCount > 0) {
                toast.error(`No se puede eliminar el grupo "${selectedGroup.name}" porque tiene ${studentsCount} estudiante(s) asociado(s). Primero debe eliminar los estudiantes del grupo.`);
                canDelete = false;
            }
        } catch (error) {
            toast.error('Error al verificar si el grupo tiene estudiantes');
            canDelete = false;
        }

        if (!canDelete) {
            return;
        }

        if (window.confirm(t.deleteGroupConfirm)) {
            try {
                await api.delete(`/groups/${selectedGroupId}`);
                toast.success(t.groupDeleted);
                localStorage.removeItem(`credentials_group_${selectedGroupId}`);

                await loadGroups();

                if (groups.length > 1) {
                    const remainingGroups = groups.filter(g => g.id !== selectedGroupId);
                    if (remainingGroups.length > 0) {
                        setSelectedGroupId(remainingGroups[0].id);
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error al eliminar el grupo');
            }
       }
    };

    const handleStudentsCreated = (estudiantesCreados) => {
        if (!selectedGroup) return;

        if (estudiantesCreados && estudiantesCreados.length > 0) {
            const nuevasCredenciales = {};
            estudiantesCreados.forEach(est => {
                if (est.username && est.generated_password) {
                    nuevasCredenciales[est.username] = est.generated_password;
                }
            });

            setAllCredentials(prev => {
                const updated = { ...prev, ...nuevasCredenciales };
                localStorage.setItem(`credentials_group_${selectedGroupId}`, JSON.stringify(updated));
                return updated;
            });

            const nuevosEstudiantes = estudiantesCreados.map(est => ({
                id: est.id,
                full_name: est.full_name,
                gender: est.gender || null,
                username: est.username,
                score: null,
                status: 'not_started'
            }));

            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === selectedGroupId
                        ? { ...group, students: [...group.students, ...nuevosEstudiantes] }
                        : group
                )
            );
        }
        setShowCrearCuentas(false);
    };

    const exportCredentials = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) {
            toast.warning(t.noStudentsWarning);
            return;
        }

        const saved = localStorage.getItem(`credentials_group_${selectedGroupId}`);
        const currentCredentials = saved ? JSON.parse(saved) : allCredentials;

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185);
        doc.setFont('helvetica', 'bold');
        doc.text("CREDENCIALES DE ACCESO", 105, 25, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Grupo: ${selectedGroup.name} - ${selectedGroup.course}`, 105, 38, { align: 'center' });
        doc.text(`Fecha de emision: ${new Date().toLocaleDateString('es-ES')}`, 105, 48, { align: 'center' });
        doc.setDrawColor(41, 128, 185);
        doc.line(20, 55, 190, 55);

        const tableData = selectedGroup.students.map((student, idx) => {
            const password = currentCredentials[student.username] || 'No disponible';
            return [
                (idx + 1).toString(),
                student.full_name || '—',
                student.gender || '—',
                student.username || '—',
                password
            ];
        });

        autoTable(doc, {
            startY: 62,
            head: [['#', 'Nombre Completo', 'Genero', 'Usuario', 'Contrasena']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
            columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 60 }, 2: { cellWidth: 25 }, 3: { cellWidth: 45 }, 4: { cellWidth: 45 } },
            styles: { fontSize: 9, cellPadding: 4 }
        });

        doc.save(`Credenciales_${selectedGroup.name}_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success(t.credentialsExported);
    };

    const handleUpdateStudentStatus = (updatedStudents) => {
        if (!selectedGroup) return;
        setGroups(groups.map(group => group.id === selectedGroup.id ? { ...group, students: updatedStudents } : group));
    };

    const publishScores = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) {
            toast.warning(t.noStudentsWarning);
        } else {
            if (window.confirm(t.publishConfirm)) {
                const updatedStudents = selectedGroup.students.map(student => ({
                    ...student,
                    score: student.score !== null ? student.score : Math.floor(Math.random() * 101),
                    status: student.status === 'not_started' ? 'finished' : student.status
                }));

                setGroups(groups.map(group =>
                    group.id === selectedGroup.id
                        ? { ...group, challengeClosed: true, students: updatedStudents }
                        : group
                ));
                toast.success(t.scoresPublished);
            }
        }
    };

    const printDiplomas = () => {
        if (!selectedGroup) return;
        if (!selectedGroup.challengeClosed) {
            toast.warning("Primero debe cerrar el desafio y publicar las puntuaciones");
            return;
        }
        if (selectedGroup.students.length === 0) {
            toast.warning(t.noStudentsWarning);
            return;
        }
        setShowExportDiplomas(true);
    };

    const handleCloseDiplomas = () => setShowExportDiplomas(false);

    const handleExportReport = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) {
            toast.warning(t.noStudentsExport);
            return;
        }
        setShowExportOptions(true);
    };

    const generateReportData = () => {
        if (!selectedGroup) return [];
        return selectedGroup.students.map(student => ({
            [t.student]: student.full_name || student.name || '—',
            'Genero': student.gender || '—',
            [t.username]: student.username || '—',
            [t.school]: selectedGroup.school || t.noSchool,
            [t.level]: selectedGroup.course,
            [t.language]: selectedGroup.language,
            [t.status]: student.status === 'finished' ? t.finished : student.status === 'in_progress' ? t.inProgress : t.notStarted,
            [t.score]: student.score !== null && student.score !== undefined ? student.score : 'N/A',
        }));
    };

    const exportToExcel = () => {
        try {
            const reportData = generateReportData();
            const worksheet = XLSX.utils.json_to_sheet(reportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Reporte_${selectedGroup.name}`);

            const summaryData = [
                [t.summaryReport], [],
                [t.totalStudents, selectedGroup.students.length],
                [t.totalFinished, selectedGroup.students.filter(s => s.status === 'finished').length],
                [t.totalInProgress, selectedGroup.students.filter(s => s.status === 'in_progress').length],
                [t.totalNotStarted, selectedGroup.students.filter(s => s.status === 'not_started').length],
                [t.averageScore, (() => { const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score); return scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2) : 'N/A'; })()],
                [t.highestScore, (() => { const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score); return scores.length ? Math.max(...scores) : 'N/A'; })()],
                [t.lowestScore, (() => { const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score); return scores.length ? Math.min(...scores) : 'N/A'; })()],
                [t.completionRate, `${((selectedGroup.students.filter(s => s.status === 'finished').length / selectedGroup.students.length) * 100).toFixed(1)}%`]
            ];
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summarySheet, `Resumen_${selectedGroup.name}`);
            XLSX.writeFile(workbook, `Reporte_participacion_${selectedGroup.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success(`${t.reportGenerated} Excel`);
        } catch (error) { console.error(error); toast.error(t.errorExport); }
        setShowExportOptions(false);
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' });
            const reportData = generateReportData();
            doc.setFontSize(18); doc.text(`${t.summaryReport}`, 14, 20);
            doc.setFontSize(10);
            let y = 30;
            doc.text(`${t.totalStudents}: ${selectedGroup.students.length}`, 14, y);
            y += 7;
            doc.text(`${t.totalFinished}: ${selectedGroup.students.filter(s => s.status === 'finished').length}`, 14, y);
            y += 7;
            doc.text(`${t.totalInProgress}: ${selectedGroup.students.filter(s => s.status === 'in_progress').length}`, 14, y);
            y += 7;
            doc.text(`${t.totalNotStarted}: ${selectedGroup.students.filter(s => s.status === 'not_started').length}`, 14, y);
            y += 7;
            const scores = selectedGroup.students.filter(s => s.score !== null).map(s => s.score);
            const avg = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2) : 'N/A';
            doc.text(`${t.averageScore}: ${avg}`, 14, y);
            y += 7;
            doc.text(`${t.completionRate}: ${((selectedGroup.students.filter(s => s.status === 'finished').length / selectedGroup.students.length) * 100).toFixed(1)}%`, 14, y);
            y += 15;
            const tableData = reportData.map(r => [r[t.student], r['Genero'], r[t.username], r[t.school], r[t.level], r[t.language], r[t.status], r[t.score]]);
            autoTable(doc, { startY: y, head: [[t.student, 'Genero', t.username, t.school, t.level, t.language, t.status, t.score]], body: tableData, theme: 'striped', headStyles: { fillColor: [41,128,185] } });
            doc.save(`Reporte_participacion_${selectedGroup.name}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success(`${t.reportGenerated} PDF`);
        } catch (error) { console.error(error); toast.error(t.errorExport); }
        setShowExportOptions(false);
    };

    const handleEditStudent = (student) => {
        setEditingStudentId(student.id);
        setEditFormData({
            full_name: student.full_name || '',
            username: student.username || '',
            gender: student.gender || ''
        });
    };

    const handleUpdateStudent = async (studentId) => {
        if (!editFormData.full_name.trim()) {
            toast.error(t.nameRequired);
            return;
        }

        setIsUpdating(true);

        try {
            const updateData = {
                full_name: editFormData.full_name,
                username: editFormData.username,
                gender: editFormData.gender
            };

            const response = await api.put(`/students/${studentId}`, updateData);

            if (response.data.success) {
                toast.success(t.studentUpdated);

                const studentsResponse = await api.get(`/groups/${selectedGroupId}/students`);
                if (studentsResponse.data && studentsResponse.data.students) {
                    setGroups(prevGroups => prevGroups.map(group =>
                        group.id === selectedGroupId
                            ? { ...group, students: studentsResponse.data.students }
                            : group
                    ));
                }

                setEditingStudentId(null);
                setEditFormData({ full_name: '', username: '', gender: '' });
            } else {
                toast.error(response.data.message || t.updateError);
            }
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
            const errorMessage = error.response?.data?.message || t.updateError;
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingStudentId(null);
        setEditFormData({ full_name: '', username: '', gender: '' });
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Estas seguro de que quieres eliminar este estudiante?')) {
            try {
                await api.delete(`/students/${studentId}`);
                const response = await api.get(`/groups/${selectedGroupId}/students`);
                if (response.data && response.data.students) {
                    setGroups(prevGroups => prevGroups.map(group =>
                        group.id === selectedGroupId
                            ? { ...group, students: response.data.students }
                            : group
                    ));
                    const studentToDelete = selectedGroup.students.find(s => s.id === studentId);
                    const updatedCredentials = { ...allCredentials };
                    if (studentToDelete) {
                        delete updatedCredentials[studentToDelete.username];
                    }
                    setAllCredentials(updatedCredentials);
                    localStorage.setItem(`credentials_group_${selectedGroupId}`, JSON.stringify(updatedCredentials));
                }
                toast.success('Estudiante eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar estudiante:', error);
                toast.error('Error al eliminar el estudiante');
            }
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'finished') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} /> {t.finished}</span>;
        if (status === 'in_progress') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Play size={12} /> {t.inProgress}</span>;
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"><Clock size={12} /> {t.notStarted}</span>;
    };

    const handleGestionarParticipantes = () => {
        if (!selectedGroup) return;
        if (selectedGroup.students.length === 0) { toast.warning(t.noStudentsWarning); return; }
        setShowGestionParticipantes(true);
    };

    const onLogout = () => window.location.reload();

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    if (showCreateGroup) {
        return <Crear_Grupo onGroupCreated={handleGroupCreated} onCancel={() => setShowCreateGroup(false)} language={language} />;
    }

    if (showCrearCuentas) {
        return <Crear_cuentas_alumnos
            onStudentsCreated={handleStudentsCreated}
            onCancel={() => setShowCrearCuentas(false)}
            groupId={selectedGroupId}
            categoryId={(() => {
                const categoryMap = { 'Super Peque': 1, 'Peque': 2, 'Benjamin': 3, 'Cadete': 4, 'Junior': 5, 'Senior': 6 };
                return categoryMap[selectedGroup?.course] || 1;
            })()}
            teacherId={teacherId}
            language={language}
        />;
    }

    if (showGestionParticipantes) {
        return <Monitoreo_participantes group={selectedGroup} onUpdateStudentStatus={handleUpdateStudentStatus} onClose={() => setShowGestionParticipantes(false)} language={language} />;
    }

    if (showExportDiplomas) {
        return <Exportar_diploma_alumno group={selectedGroup} onClose={handleCloseDiplomas} language={language} />;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-sky-100 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <Users className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                {t.subtitle} — {teacherName || 'Maestro'} ({teacherEmail || 'sin email'})
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('es')}>ES</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('en')}>EN</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('pt')}>PT</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('fr')}>FR</button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md" onClick={onLogout}>
                            <LogOut size={16} /> {t.logout}
                        </button>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <img src={castorcubasi} alt="castorcubasi" className="w-30 h-30 shadow-md" />
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800">{t.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Users size={20} className="text-blue-600" /> {t.groups}
                            {groups.length > 0 && (
                                <span className="text-sm font-normal text-slate-500 ml-2">
                                    ({groups.length} grupos)
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={() => setShowCreateGroup(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
                        >
                            <Plus size={18} /> {t.createGroup}
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-slate-500 mt-2">Cargando grupos...</p>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 mb-4">No tienes grupos creados aun</p>
                            <button onClick={() => setShowCreateGroup(true)} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all">
                                Crear tu primer grupo
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.selectGroup}</label>
                                <select
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                    className="w-full md:w-64 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.name} {group.school && `(${group.school})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedGroup && (
                                <>
                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 mb-6 border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-800">{selectedGroup.name}</h3>
                                                <p className="text-sm text-slate-500 mt-1">{selectedGroup.school || t.noSchool}</p>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Globe size={14} /> {selectedGroup.language}</span>
                                                    <span className="inline-flex items-center gap-1 text-sm text-slate-600"><BookOpen size={14} /> {selectedGroup.course}</span>
                                                    <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Users size={14} /> {selectedGroup.students.length} {t.studentsCount}</span>
                                                    {selectedGroup.challengeClosed && <span className="inline-flex items-center gap-1 text-sm text-red-600"><Lock size={14} /> {t.challengeClosedLabel}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button  onClick={() => {
                                                    handleDeleteGroup();
                                                    console.log('🖱️ Botón clickeado');
                                                    console.log('🔄 Renderizando, selectedGroup:', selectedGroup);

                                                }}  className="p-2 rounded-lg bg-white text-red-600 hover:bg-red-50 transition-all shadow-sm border border-slate-200" title={t.deleteGroup}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mb-8">
                                        <button onClick={handleGestionarParticipantes} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md">
                                            <Users size={16} /> {t.monitorParticipants}
                                        </button>
                                        {!selectedGroup.challengeClosed && (
                                            <button onClick={publishScores} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-md">
                                                <BarChart3 size={16} /> {t.closeChallenge}
                                            </button>
                                        )}
                                        {selectedGroup.challengeClosed && (
                                            <>
                                                <button onClick={printDiplomas} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-all shadow-md">
                                                    <FileDown size={16} /> {t.exportDiplomas}
                                                </button>
                                                <button onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-600 text-white font-medium hover:bg-zinc-700 transition-all shadow-md">
                                                    <Download size={16} /> {t.exportReport}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {selectedGroup.students.length > 0 && (
                                        <div className="mb-6">
                                            <button
                                                onClick={exportCredentials}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md"
                                            >
                                                <Key size={16} /> {t.exportCredentials}
                                            </button>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex flex-wrap justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                                <Users size={18} className="text-blue-600" /> {t.students}
                                            </h2>
                                            <div className="flex gap-2">
                                                <button onClick={() => setShowCrearCuentas(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-all shadow-md">
                                                    <UserPlus size={16} /> {t.createAccounts}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Genero</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.username}</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.student}</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.score}</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.status}</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.actions}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {selectedGroup.students && selectedGroup.students.length > 0 ? (
                                                    selectedGroup.students.map((student) => (
                                                        editingStudentId === student.id ? (
                                                            <tr key={student.id} className="border-b border-slate-100 bg-blue-50">
                                                                <td className="px-4 py-2">
                                                                    <select
                                                                        value={editFormData.gender || ''}
                                                                        onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                                                                        className="w-full px-2 py-1 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                                    >
                                                                        <option value="">Seleccionar</option>
                                                                        <option value="Femenino">Femenino</option>
                                                                        <option value="Masculino">Masculino</option>
                                                                    </select>
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={editFormData.username}
                                                                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                                                        className="w-full px-2 py-1 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                                        placeholder="Usuario"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={editFormData.full_name}
                                                                        onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                                                                        className="w-full px-2 py-1 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                                        placeholder="Nombre completo"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-2 text-sm font-bold">{student.score !== null && student.score !== undefined ? student.score : '—'}</td>
                                                                <td className="px-4 py-2">{getStatusBadge(student.status || 'not_started')}</td>
                                                                <td className="px-4 py-2 flex gap-2">
                                                                    <button onClick={() => handleUpdateStudent(student.id)} disabled={isUpdating} className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50" title={t.save}>
                                                                        <Save size={16} />
                                                                    </button>
                                                                    <button onClick={handleCancelEdit} className="p-1 text-red-600 hover:bg-red-50 rounded" title={t.cancel}>
                                                                        <X size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                                <td className="px-4 py-2 text-sm">
                                                                    {student.gender === 'Femenino' ? (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
                                                                                Femenino
                                                                            </span>
                                                                    ) : student.gender === 'Masculino' ? (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                                                Masculino
                                                                            </span>
                                                                    ) : (
                                                                        <span className="text-gray-400 text-xs">—</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm font-medium">
                                                                    {student.username || '—'}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm font-medium">
                                                                    {student.full_name || student.name || '—'}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm font-bold">
                                                                    {student.score !== null && student.score !== undefined ? student.score : '—'}
                                                                </td>
                                                                <td className="px-4 py-2">{getStatusBadge(student.status || 'not_started')}</td>
                                                                <td className="px-4 py-2 flex gap-2">
                                                                    <button onClick={() => handleEditStudent(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title={t.edit}>
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteStudent(student.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title={t.delete}>
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                                            {t.noStudentsTable}
                                                        </td>
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

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <AlertCircle size={18} className="text-blue-600" />
                        {t.teacherMessageTitle}
                    </h3>
                    <div className="text-slate-700 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {teacherWelcomeMessage}
                    </div>
                </div>

                {showExportOptions && selectedGroup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExportOptions(false)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                                <h2 className="text-xl font-bold"><Download size={20} className="inline mr-2 text-yellow-500" /> {t.exportFormat} - {selectedGroup.name}</h2>
                                <button onClick={() => setShowExportOptions(false)}><X size={20} /></button>
                            </div>
                            <p className="text-slate-600 mb-6 text-sm">{t.selectFormat}</p>
                            <div className="flex gap-4">
                                <button onClick={exportToExcel} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700">
                                    <FileSpreadsheet size={20} /> {t.excel}
                                </button>
                                <button onClick={exportToPDF} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700">
                                    <FileText size={20} /> {t.pdf}
                                </button>
                            </div>
                            <button onClick={() => setShowExportOptions(false)} className="w-full mt-4 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50">
                                {t.cancel}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gestion_grupos_estudiantes;