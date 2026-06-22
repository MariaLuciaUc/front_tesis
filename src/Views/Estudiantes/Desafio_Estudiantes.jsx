// Desafio_Estudiantes.jsx
import React, { useState, useEffect } from 'react';
import { Clock, LogOut, Target, List, Trophy, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import Pregunta from './Pregunta';

const API_BASE_URL = 'http://localhost:8000';

const translations = {
    es: {
        timeLabel: "Tiempo restante",
        exitButton: "Salir",
        finishButton: "Finalizar",
        progressLabel: "Progreso en la categoria",
        questionsTitle: "Tareas de la categoria",
        exitModalTitle: "Salir del desafio?",
        exitModalText: "Si sales ahora, perderas todo tu progreso. Estas seguro?",
        confirmExit: "Si, salir",
        cancel: "Cancelar",
        completedTitle: "Desafio completado",
        congrats: "lo hiciste increible!",
        noTasks: "No hay tareas disponibles para esta categoria.",
        finishModalTitle: "Finalizar desafio?",
        finishModalText: "Estas seguro de que quieres finalizar? La puntuacion se mostrara al finalizar.",
        apiError: "Error de conexion con el servidor. Verifica que el backend de Laravel este corriendo en el puerto correcto.",
        selectAll: "Seleccionar todas",
        deselectAll: "Deseleccionar todas",
        evaluate: "Evaluar",
        loading: "Cargando tareas de",
        backToPanel: "Volver al Panel",
        selectedTasks: "tarea(s) seleccionada(s)",
        tasks: "tareas",
        options: "opciones",
        task: "Tarea",
        noDescription: "Sin descripcion.",
        infoNotAvailable: "Informacion no disponible",
        selectAllTasks: "Seleccionar todas las tareas",
        deselectAllTasks: "Deseleccionar todas las tareas",
        youHave: "Tienes",
        of: "de",
        clickToSelect: "Haz clic en una tarea o en su checkbox para seleccionar/deseleccionar",
        finish: "Finalizar",
        rememberMessage: "Recuerda que solo las preguntas que esten marcadas como Evaluar contaran para la puntuacion final",
        backToTasks: "Volver a la lista de tareas",
        taskDetails: "Detalle de la tarea",
        difficulty: "Dificultad",
        question: "Pregunta",
        submitted: "Enviada",
        pending: "Pendiente",
        progress: "Progreso",
        evaluateQuestion: "Evaluar esta pregunta",
        totalScore: "Puntuacion total",
        correctAnswers: "Respuestas correctas",
        evaluatedQuestions: "Preguntas evaluadas",
        totalPossible: "Puntuacion maxima posible",
        score: "Puntuacion",
        yourScore: "Tu puntuacion",
        alreadySubmitted: "Esta respuesta ya fue guardada anteriormente",
        answerAlreadySaved: "Respuesta ya guardada",
        emptyAnswer: "Debes escribir una respuesta antes de guardar",
        invalidNumber: "Debes ingresar un numero valido",
        selectOption: "Debes seleccionar una opcion antes de guardar",
        answerRequired: "Respuesta requerida",
        answerSaved: "Respuesta guardada",
        finishConfirm: "Finalizar desafio",
        evaluating: "Calculando puntuacion..."
    },
    en: {
        timeLabel: "Time remaining",
        exitButton: "Exit",
        finishButton: "Finish",
        progressLabel: "Progress in category",
        questionsTitle: "Category tasks",
        exitModalTitle: "Exit challenge?",
        exitModalText: "If you exit now, you will lose all your progress. Are you sure?",
        confirmExit: "Yes, exit",
        cancel: "Cancel",
        completedTitle: "Challenge completed",
        congrats: "you did amazing!",
        noTasks: "No tasks available for this category.",
        finishModalTitle: "Finish challenge?",
        finishModalText: "Are you sure you want to finish? The score will be shown after finishing.",
        apiError: "Connection error with the server. Verify that the Laravel backend is running on the correct port.",
        selectAll: "Select all",
        deselectAll: "Deselect all",
        evaluate: "Evaluate",
        loading: "Loading tasks from",
        backToPanel: "Back to Panel",
        selectedTasks: "task(s) selected",
        tasks: "tasks",
        options: "options",
        task: "Task",
        noDescription: "No description.",
        infoNotAvailable: "Information not available",
        selectAllTasks: "Select all tasks",
        deselectAllTasks: "Deselect all tasks",
        youHave: "You have",
        of: "of",
        clickToSelect: "Click on a task or its checkbox to select/deselect",
        finish: "Finish",
        rememberMessage: "Remember that only questions marked as Evaluate will count towards the final score",
        backToTasks: "Back to task list",
        taskDetails: "Task details",
        difficulty: "Difficulty",
        question: "Question",
        submitted: "Submitted",
        pending: "Pending",
        progress: "Progress",
        evaluateQuestion: "Evaluate this question",
        totalScore: "Total score",
        correctAnswers: "Correct answers",
        evaluatedQuestions: "Evaluated questions",
        totalPossible: "Maximum possible score",
        score: "Score",
        yourScore: "Your score",
        alreadySubmitted: "This answer has already been saved",
        answerAlreadySaved: "Answer already saved",
        emptyAnswer: "You must write an answer before saving",
        invalidNumber: "You must enter a valid number",
        selectOption: "You must select an option before saving",
        answerRequired: "Answer required",
        answerSaved: "Answer saved",
        finishConfirm: "Finish challenge",
        evaluating: "Calculating score..."
    },
    pt: {
        timeLabel: "Tempo restante",
        exitButton: "Sair",
        finishButton: "Finalizar",
        progressLabel: "Progresso na categoria",
        questionsTitle: "Tarefas da categoria",
        exitModalTitle: "Sair do desafio?",
        exitModalText: "Se voce sair agora, perdera todo o seu progresso. Tem certeza?",
        confirmExit: "Sim, sair",
        cancel: "Cancelar",
        completedTitle: "Desafio concluido",
        congrats: "voce foi incrivel!",
        noTasks: "Nao ha tarefas disponiveis para esta categoria.",
        finishModalTitle: "Finalizar desafio?",
        finishModalText: "Tem certeza que deseja finalizar? A pontuacao sera mostrada ao finalizar.",
        apiError: "Erro de conexao com o servidor. Verifique se o backend Laravel esta rodando na porta correta.",
        selectAll: "Selecionar todas",
        deselectAll: "Desmarcar todas",
        evaluate: "Avaliar",
        loading: "Carregando tarefas de",
        backToPanel: "Voltar ao Painel",
        selectedTasks: "tarefa(s) selecionada(s)",
        tasks: "tarefas",
        options: "opcoes",
        task: "Tarefa",
        noDescription: "Sem descricao.",
        infoNotAvailable: "Informacao nao disponivel",
        selectAllTasks: "Selecionar todas as tarefas",
        deselectAllTasks: "Desmarcar todas as tarefas",
        youHave: "Voce tem",
        of: "de",
        clickToSelect: "Clique em uma tarefa ou em sua caixa de selecao para selecionar/desselecionar",
        finish: "Finalizar",
        rememberMessage: "Lembre-se de que apenas as perguntas marcadas como Avaliar contarao para a pontuacao final",
        backToTasks: "Voltar a lista de tarefas",
        taskDetails: "Detalhes da tarefa",
        difficulty: "Dificuldade",
        question: "Pergunta",
        submitted: "Enviada",
        pending: "Pendente",
        progress: "Progresso",
        evaluateQuestion: "Avaliar esta pergunta",
        totalScore: "Pontuacao total",
        correctAnswers: "Respostas corretas",
        evaluatedQuestions: "Perguntas avaliadas",
        totalPossible: "Pontuacao maxima possivel",
        score: "Pontuacao",
        yourScore: "Sua pontuacao",
        alreadySubmitted: "Esta resposta ja foi salva anteriormente",
        answerAlreadySaved: "Resposta ja salva",
        emptyAnswer: "Voce deve escrever uma resposta antes de salvar",
        invalidNumber: "Voce deve inserir um numero valido",
        selectOption: "Voce deve selecionar uma opcao antes de salvar",
        answerRequired: "Resposta obrigatoria",
        answerSaved: "Resposta salva",
        finishConfirm: "Finalizar desafio",
        evaluating: "Calculando pontuacao..."
    },
    fr: {
        timeLabel: "Temps restant",
        exitButton: "Quitter",
        finishButton: "Terminer",
        progressLabel: "Progression dans la categorie",
        questionsTitle: "Taches de la categorie",
        exitModalTitle: "Quitter le defi?",
        exitModalText: "Si vous quittez maintenant, vous perdrez toute votre progression. Etes-vous sur?",
        confirmExit: "Oui, quitter",
        cancel: "Annuler",
        completedTitle: "Defi termine",
        congrats: "vous avez fait un travail incroyable!",
        noTasks: "Aucune tache disponible pour cette categorie.",
        finishModalTitle: "Terminer le defi?",
        finishModalText: "Etes-vous sur de vouloir terminer? Le score sera affiche apres la fin.",
        apiError: "Erreur de connexion au serveur. Verifiez que le backend Laravel tourne sur le bon port.",
        selectAll: "Tout selectionner",
        deselectAll: "Tout deselectionner",
        evaluate: "Evaluer",
        loading: "Chargement des taches de",
        backToPanel: "Retour au Panneau",
        selectedTasks: "tache(s) selectionnee(s)",
        tasks: "taches",
        options: "options",
        task: "Tache",
        noDescription: "Aucune description.",
        infoNotAvailable: "Informations non disponibles",
        selectAllTasks: "Selectionner toutes les taches",
        deselectAllTasks: "Deselectionner toutes les taches",
        youHave: "Vous avez",
        of: "sur",
        clickToSelect: "Cliquez sur une tache ou sa case a cocher pour selectionner/deselectionner",
        finish: "Terminer",
        rememberMessage: "Rappelez-vous que seules les questions marquees comme Evaluer compteront pour le score final",
        backToTasks: "Retour a la liste des taches",
        taskDetails: "Details de la tache",
        difficulty: "Difficulte",
        question: "Question",
        submitted: "Soumise",
        pending: "En attente",
        progress: "Progres",
        evaluateQuestion: "Evaluer cette question",
        totalScore: "Score total",
        correctAnswers: "Reponses correctes",
        evaluatedQuestions: "Questions evaluees",
        totalPossible: "Score maximum possible",
        score: "Score",
        yourScore: "Votre score",
        alreadySubmitted: "Cette reponse a deja ete enregistree",
        answerAlreadySaved: "Reponse deja enregistree",
        emptyAnswer: "Vous devez ecrire une reponse avant d'enregistrer",
        invalidNumber: "Vous devez saisir un nombre valide",
        selectOption: "Vous devez selectionner une option avant d'enregistrer",
        answerRequired: "Reponse requise",
        answerSaved: "Reponse enregistree",
        finishConfirm: "Terminer le defi",
        evaluating: "Calcul du score..."
    }
};

const categoryMap = {
    "Super-Peque": 1,
    "Peque": 2,
    "Benjamin": 3,
    "Cadete": 4,
    "Junior": 5,
    "Senior": 6
};

const Desafio_Estudiantes = (props) => {
    const { studentData, onBackToPanel, language = 'es', contestConfig, categoryId, categoryName } = props;
    const [currentLanguage, setCurrentLanguage] = useState(language);
    const t = translations[currentLanguage] || translations.es;

    const [name] = useState(studentData?.name || 'Estudiante');
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [finalScoreData, setFinalScoreData] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFinishing, setIsFinishing] = useState(false);

    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [submittedQuestions, setSubmittedQuestions] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [allTasksData, setAllTasksData] = useState([]);

    useEffect(() => {
        if (timeLeft === null && !finished) {
            const savedTime = localStorage.getItem(`bebrasTime_cat_${categoryId}`);
            if (savedTime) {
                setTimeLeft(parseInt(savedTime));
            } else {
                const categoryExecutionTime = contestConfig?.executionTime || 45;
                setTimeLeft(categoryExecutionTime * 60);
            }
        }
    }, [contestConfig, finished, categoryId]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0 && !finished) {
            localStorage.setItem(`bebrasTime_cat_${categoryId}`, timeLeft);
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !finished) {
            handleFinalizar();
        }
    }, [timeLeft, finished, categoryId]);

    useEffect(() => {
        if (questions.length > 0) {
            const initialSelected = {};
            questions.forEach(q => {
                initialSelected[q.id] = true;
            });
            setSelectedQuestions(initialSelected);
        }
    }, [questions]);

    const formatTime = (seconds) => {
        if (seconds === null) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Funcion mejorada para comparar respuestas (incluyendo imagenes)
    const isAnswerCorrect = (studentAnswer, question) => {
        if (!studentAnswer || studentAnswer.trim() === '') {
            return false;
        }

        let correctAnswer = question.correctAnswer || question.correctOption || question.answer || '';

        if (!correctAnswer || correctAnswer.trim() === '') {
            console.warn('Pregunta sin respuesta correcta:', question.id, question.title);
            return false;
        }

        const studentTrimmed = studentAnswer.trim();
        const correctTrimmed = correctAnswer.trim();

        // Para preguntas numericas
        if (question.type === 'numeric') {
            const studentNum = parseFloat(studentTrimmed);
            const correctNum = parseFloat(correctTrimmed);
            if (isNaN(studentNum) || isNaN(correctNum)) {
                return false;
            }
            return studentNum === correctNum;
        }

        // Para preguntas con imagenes: normalizar nombres de archivos
        const normalizeFileName = (str) => {
            return str
                .toLowerCase()
                .replace(/^.*[\\\/]/, '')
                .replace(/\.[^.]+$/, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        const looksLikeImage = (str) => {
            return /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(str) ||
                /^imagen\s*[a-d]/i.test(str) ||
                /^[a-d]\s*\.\s*(jpg|jpeg|png|gif|svg|webp)/i.test(str);
        };

        const isLetter = (str) => /^[a-d]$/i.test(str.trim());
        const isImageOption = (str) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(str) || /^imagen\s*[a-d]/i.test(str);

        if (isLetter(correctTrimmed) && isImageOption(studentTrimmed)) {
            const letterMatch = studentTrimmed.match(/[a-d]/i);
            if (letterMatch) {
                return letterMatch[0].toLowerCase() === correctTrimmed.toLowerCase();
            }
            return false;
        }

        if (isLetter(studentTrimmed) && isImageOption(correctTrimmed)) {
            const letterMatch = correctTrimmed.match(/[a-d]/i);
            if (letterMatch) {
                return studentTrimmed.toLowerCase() === letterMatch[0].toLowerCase();
            }
            return false;
        }

        if (looksLikeImage(studentTrimmed) || looksLikeImage(correctTrimmed)) {
            const studentNormalized = normalizeFileName(studentTrimmed);
            const correctNormalized = normalizeFileName(correctTrimmed);
            return studentNormalized === correctNormalized;
        }

        return studentTrimmed.toLowerCase() === correctTrimmed.toLowerCase();
    };

    const calculateScore = () => {
        let totalScore = 0;
        let totalEvaluated = 0;
        let correctCount = 0;
        let totalPossibleScore = 0;
        let evaluatedDetails = [];

        questions.forEach(q => {
            const questionId = q.id;
            if (selectedQuestions[questionId]) {
                totalEvaluated++;
                const points = q.points || 10;
                totalPossibleScore += points;

                if (submittedQuestions[questionId]) {
                    const studentAnswer = answers[questionId] || '';
                    const isCorrect = isAnswerCorrect(studentAnswer, q);

                    if (isCorrect) {
                        totalScore += points;
                        correctCount++;
                    }

                    evaluatedDetails.push({
                        id: questionId,
                        title: q.title || q.name,
                        points: points,
                        isCorrect: isCorrect,
                        studentAnswer: studentAnswer || 'No respondida',
                        correctAnswer: q.correctAnswer || q.correctOption || q.answer || 'No definida'
                    });
                } else {
                    evaluatedDetails.push({
                        id: questionId,
                        title: q.title || q.name,
                        points: points,
                        isCorrect: false,
                        studentAnswer: 'No enviada',
                        correctAnswer: q.correctAnswer || q.correctOption || q.answer || 'No definida'
                    });
                }
            }
        });

        return {
            totalScore,
            totalEvaluated,
            correctCount,
            totalPossibleScore,
            evaluatedDetails,
            unansweredCount: totalEvaluated - Object.keys(submittedQuestions).filter(id =>
                submittedQuestions[id] && selectedQuestions[id]
            ).length
        };
    };

    const handleFinalizar = () => {
        setIsFinishing(true);
        setFinished(true);
        setShowFinishModal(false);
        localStorage.removeItem(`bebrasTime_cat_${categoryId}`);

        const scoreData = calculateScore();
        setFinalScore(scoreData.totalScore);
        setFinalScoreData(scoreData);
        setIsFinishing(false);
    };

    const confirmExit = () => {
        localStorage.removeItem(`bebrasTime_cat_${categoryId}`);
        onBackToPanel && onBackToPanel();
    };

    const trimString = (str) => {
        return str ? String(str).trim() : '';
    };

    const handleQuestionToggle = (questionId) => {
        setSelectedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleLanguageChange = (lang) => {
        setCurrentLanguage(lang);
    };

    const handleOpenTask = (task, index) => {
        const fullTaskData = allTasksData.find(t =>
            trimString(t.taskCode) === trimString(task.task_code)
        );

        if (fullTaskData) {
            setSelectedTask({
                ...fullTaskData,
                serverId: task.id,
                points: task.points || 10,
                images: fullTaskData.images ? fullTaskData.images.map(img => {
                    if (img.startsWith('/images/')) {
                        return img;
                    }
                    return `/images/${img}`;
                }) : [],
                options: fullTaskData.options ? fullTaskData.options.map(opt => {
                    if (typeof opt === 'string' && opt.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
                        if (opt.startsWith('/images/')) {
                            return opt;
                        }
                        return `/images/${opt}`;
                    }
                    return opt;
                }) : []
            });
        } else {
            setSelectedTask({
                ...task,
                points: task.points || 10,
                images: task.image ? [`/images/${task.image}`] : [],
                options: task.options || [],
                type: task.type || 'single-choice'
            });
        }
        setCurrentQuestionIndex(index);
    };

    const handleBackToTasks = () => {
        setSelectedTask(null);
        setCurrentQuestionIndex(0);
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            const prevTask = questions[currentQuestionIndex - 1];
            handleOpenTask(prevTask, currentQuestionIndex - 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            const nextTask = questions[currentQuestionIndex + 1];
            handleOpenTask(nextTask, currentQuestionIndex + 1);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmitAnswer = (questionId) => {
        if (submittedQuestions[questionId]) {
            toast.warning(t.alreadySubmitted);
            return;
        }

        const currentQuestion = questions.find(q => q.id === questionId);
        if (!currentQuestion) {
            toast.error('Error: No se encontro la pregunta');
            return;
        }

        const studentAnswer = answers[questionId] || '';
        const type = currentQuestion.type || 'single-choice';

        if (type === 'numeric') {
            if (studentAnswer.trim() === '') {
                toast.warning(t.emptyAnswer);
                return;
            }
            const numValue = Number(studentAnswer.trim());
            if (isNaN(numValue)) {
                toast.warning(t.invalidNumber);
                return;
            }
        } else if (type === 'text' || type === 'open') {
            if (studentAnswer.trim() === '') {
                toast.warning(t.emptyAnswer);
                return;
            }
        } else {
            if (studentAnswer.trim() === '') {
                toast.warning(t.selectOption);
                return;
            }
        }

        setSubmittedQuestions(prev => ({
            ...prev,
            [questionId]: true
        }));
        toast.success(t.answerSaved);
    };

    const cardColors = [
        '#3B82F6', '#8B5CF6', '#EC4899', '#22C55E',
        '#EAB308', '#EF4444', '#6366F1', '#14B8A6'
    ];

    // Carga de datos
    useEffect(() => {
        const cargarDatos = async () => {
            const contestId = contestConfig?.id || localStorage.getItem('current_contest_id') || 1;

            try {
                setLoading(true);
                setError(null);

                const url = `${API_BASE_URL}/api/contest_tasks/${contestId}`;
                console.log(`Cargando tareas del concurso ID: ${contestId}`);
                const response = await axios.get(url);

                if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
                    throw new Error(t.apiError);
                }

                let allTasks = [];
                if (Array.isArray(response.data)) {
                    allTasks = response.data;
                } else if (response.data && typeof response.data === 'object') {
                    if (Array.isArray(response.data.data)) {
                        allTasks = response.data.data;
                    } else if (Array.isArray(response.data.tasks)) {
                        allTasks = response.data.tasks;
                    } else {
                        allTasks = Object.values(response.data).filter(item => typeof item === 'object' && item !== null);
                    }
                }

                if (allTasks.length === 0) {
                    setQuestions([]);
                    setLoading(false);
                    return;
                }

                const filteredByCategory = allTasks.filter(task => Number(task.category_id) === Number(categoryId));

                if (filteredByCategory.length === 0) {
                    setQuestions([]);
                    setLoading(false);
                    return;
                }

                const jsonResponse = await fetch('/tasks.json');
                if (!jsonResponse.ok) {
                    throw new Error(`Error al cargar tasks.json: ${jsonResponse.status}`);
                }
                const jsonData = await jsonResponse.json();
                const rawTasks = jsonData.tasks || [];
                setAllTasksData(rawTasks);

                const formattedQuestions = filteredByCategory.map((serverTask) => {
                    const codigoLimpio = trimString(serverTask.task_code);

                    const taskDetails = rawTasks.find(t => {
                        const codeMatch = trimString(t.taskCode) === codigoLimpio;
                        const catTexto = t.category || '';
                        const catIdJSON = categoryMap[catTexto];
                        return codeMatch && catIdJSON === Number(categoryId);
                    });

                    const serverPoints = serverTask.points;

                    if (taskDetails) {
                        const points = (serverPoints !== undefined && serverPoints !== null) ? serverPoints : 10;

                        return {
                            id: serverTask.id,
                            task_code: serverTask.task_code,
                            title: taskDetails.title || taskDetails.name || `${t.task} ${codigoLimpio}`,
                            name: taskDetails.title || taskDetails.name || `${t.task} ${codigoLimpio}`,
                            text: taskDetails.description || taskDetails.text || t.noDescription,
                            question: taskDetails.question || taskDetails.text || t.noDescription,
                            description: taskDetails.description || taskDetails.text || t.noDescription,
                            type: taskDetails.type || 'single-choice',
                            options: Array.isArray(taskDetails.options) ? taskDetails.options.map(opt => {
                                if (typeof opt === 'string' && opt.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
                                    return `/images/${opt}`;
                                }
                                return opt;
                            }) : [],
                            answer: taskDetails.correctOption || taskDetails.correctAnswer || '',
                            correctOption: taskDetails.correctOption || null,
                            correctAnswer: taskDetails.correctAnswer || taskDetails.correctOption || '',
                            image: taskDetails.images?.[0] || null,
                            images: taskDetails.images ? taskDetails.images.map(img => {
                                if (img.startsWith('/images/')) {
                                    return img;
                                }
                                return `/images/${img}`;
                            }) : [],
                            difficulty: taskDetails.difficulty || 'Media',
                            category: taskDetails.category || categoryName,
                            ageGroup: taskDetails.ageGroup || '',
                            explanation: taskDetails.explanation || '',
                            solution: taskDetails.solution || '',
                            evaluation: taskDetails.evaluation || {},
                            display_order: Number(serverTask.display_order) || 1,
                            instructions: taskDetails.instructions || '',
                            points: points
                        };
                    } else {
                        const points = (serverPoints !== undefined && serverPoints !== null) ? serverPoints : 10;

                        return {
                            id: serverTask.id,
                            task_code: serverTask.task_code,
                            title: `${t.task} ${codigoLimpio}`,
                            name: `${t.task} ${codigoLimpio}`,
                            text: t.infoNotAvailable,
                            question: t.infoNotAvailable,
                            description: t.infoNotAvailable,
                            type: 'single-choice',
                            options: [],
                            answer: '',
                            correctOption: null,
                            correctAnswer: '',
                            image: null,
                            images: [],
                            difficulty: 'Media',
                            category: categoryName,
                            ageGroup: '',
                            explanation: '',
                            solution: '',
                            evaluation: {},
                            display_order: Number(serverTask.display_order) || 1,
                            instructions: '',
                            points: points
                        };
                    }
                });

                formattedQuestions.sort((a, b) => a.display_order - b.display_order);
                setQuestions(formattedQuestions);
                setLoading(false);

            } catch (error) {
                console.error("Error:", error);
                setError(error.message || "Error al cargar los datos.");
                toast.error(t.apiError);
                setLoading(false);
            }
        };

        cargarDatos();
    }, [contestConfig, categoryId, t]);

    const submittedCount = Object.keys(submittedQuestions).filter(key => submittedQuestions[key] === true).length;

    // Renderizado de la pregunta detallada
    if (selectedTask) {
        const currentTask = selectedTask;
        const questionId = currentTask.serverId || currentTask.id;
        const isSubmitted = submittedQuestions[questionId] || false;
        const currentAnswer = answers[questionId] || '';

        return (
            <div className="min-h-screen bg-blue-50">
                <div className="bg-blue-600 shadow-lg sticky top-0 z-10 px-4 py-3">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBackToTasks}
                                className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-sm font-medium">{t.backToTasks}</span>
                            </button>
                            <span className="text-white font-medium">
                                {t.taskDetails}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white font-mono font-bold">
                            <Clock size={18} className="text-yellow-300" />
                            <span className="text-lg">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)]">
                    <Pregunta
                        question={{
                            ...currentTask,
                            text: currentTask.description || currentTask.text,
                            instructions: currentTask.instructions || ''
                        }}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        answer={currentAnswer}
                        isSubmitted={isSubmitted}
                        onAnswerChange={(value) => handleAnswerChange(questionId, value)}
                        onSubmit={() => handleSubmitAnswer(questionId)}
                        onPrevious={handlePreviousQuestion}
                        onNext={handleNextQuestion}
                        isFirst={currentQuestionIndex === 0}
                        isLast={currentQuestionIndex === questions.length - 1}
                        language={currentLanguage}
                        initialLeftWidth={50}
                    />
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-blue-600 font-medium text-lg">
                        {t.loading} {categoryName}...
                    </div>
                </div>
            </div>
        );
    }

    if (finished) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <div className="relative">
                        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Trophy size={48} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-blue-600 mb-2">
                        {t.completedTitle}
                    </h2>
                    <p className="text-gray-600 mb-4 text-lg">
                        {name}, {t.congrats}
                    </p>
                    <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-100">
                        <span className="text-sm text-gray-600 block font-medium">
                            {t.totalScore}:
                        </span>
                        <span className="text-5xl font-extrabold text-blue-600">
                            {finalScore || 0}
                        </span>
                        {finalScoreData && (
                            <>
                                <span className="text-sm text-gray-500 block mt-1">
                                    {t.correctAnswers}: {finalScoreData.correctCount} / {finalScoreData.totalEvaluated}
                                </span>
                                <span className="text-sm text-gray-500 block">
                                    {t.evaluatedQuestions}: {finalScoreData.totalEvaluated}
                                </span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onBackToPanel}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                        {t.backToPanel}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="bg-blue-600 shadow-lg sticky top-0 z-10 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Target className="text-white" size={24} />
                        </div>
                        <span className="font-bold text-white text-lg">
                            {categoryName}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex gap-1 bg-white/20 p-1 rounded-full border border-white/30">
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currentLanguage === 'es' ? 'bg-white text-blue-600' : 'text-white/70 hover:text-white'}`}
                                onClick={() => handleLanguageChange('es')}
                            >
                                ES
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currentLanguage === 'en' ? 'bg-white text-blue-600' : 'text-white/70 hover:text-white'}`}
                                onClick={() => handleLanguageChange('en')}
                            >
                                EN
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currentLanguage === 'pt' ? 'bg-white text-blue-600' : 'text-white/70 hover:text-white'}`}
                                onClick={() => handleLanguageChange('pt')}
                            >
                                PT
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currentLanguage === 'fr' ? 'bg-white text-blue-600' : 'text-white/70 hover:text-white'}`}
                                onClick={() => handleLanguageChange('fr')}
                            >
                                FR
                            </button>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white font-mono font-bold border border-white/30">
                            <Clock size={18} className="text-yellow-300" />
                            <span className="text-lg">{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all cursor-pointer"
                        >
                            {t.exitButton}
                        </button>
                        <button
                            onClick={() => setShowFinishModal(true)}
                            className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-full font-medium shadow-md transition-all cursor-pointer"
                        >
                            {t.finishButton}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-blue-100 px-4 py-4 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-blue-600 flex items-center gap-2">
                            <BookOpen size={16} /> {t.progress}
                        </span>
                        <span className="text-purple-600 font-bold">
                            {submittedCount} / {questions.length} {t.submitted}
                        </span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${questions.length > 0 ? (submittedCount / questions.length) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                    <div className="p-6 bg-blue-50 border-b border-blue-100">
                        <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-3">
                            <List className="text-blue-600" size={24} />
                            {t.questionsTitle}
                            <span className="ml-2 text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full">
                                {questions.length} {t.tasks}
                            </span>
                        </h3>
                    </div>

                    {error && (
                        <div className="p-4 text-red-600 bg-red-50 border-b border-red-200 text-sm m-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    {questions.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-400 font-medium text-lg">{t.noTasks}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-blue-50">
                            {questions.map((q, idx) => {
                                const colorIndex = (q.display_order || idx) % cardColors.length;
                                const bgColor = cardColors[colorIndex];
                                const isChecked = selectedQuestions[q.id] || false;
                                const isSubmitted = submittedQuestions[q.id] || false;

                                return (
                                    <div
                                        key={q.id}
                                        className="p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-blue-50"
                                        onClick={() => handleOpenTask(q, idx)}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            {q.display_order || idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-semibold text-gray-800 truncate">
                                                    {q.title || q.name}
                                                </p>
                                                {isSubmitted && (
                                                    <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <CheckCircle size={12} />
                                                        {t.submitted}
                                                    </span>
                                                )}
                                                <span className="flex-shrink-0 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    {q.points || 10} pts
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 flex flex-col items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleQuestionToggle(q.id)}
                                                className="w-6 h-6 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                                style={{ accentColor: '#3B82F6' }}
                                            />
                                            <span className="text-xs font-medium text-blue-600">{t.evaluate}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {questions.length > 0 && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl">
                        <p className="text-sm text-yellow-700 text-center font-medium">
                            {t.rememberMessage}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de Finalizacion - SIN mostrar puntuacion */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <div className="text-center mb-4">
                            <h4 className="text-2xl font-bold text-gray-800">{t.finishModalTitle}</h4>
                        </div>
                        <p className="text-gray-600 text-center mb-6">{t.finishModalText}</p>

                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <div className="text-center">
                                <p className="text-sm text-blue-600 font-medium">
                                    {t.evaluating}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {t.correctAnswers}: {Object.keys(submittedQuestions).filter(id => submittedQuestions[id]).length} / {questions.length}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t.evaluatedQuestions}: {Object.values(selectedQuestions).filter(v => v).length}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFinishModal(false)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleFinalizar}
                                disabled={isFinishing}
                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {isFinishing ? t.evaluating : t.finishConfirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExitModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <div className="text-center mb-4">
                            <h4 className="text-2xl font-bold text-red-600">{t.exitModalTitle}</h4>
                        </div>
                        <p className="text-gray-600 text-center mb-6">{t.exitModalText}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={confirmExit}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
                            >
                                {t.confirmExit}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Desafio_Estudiantes;