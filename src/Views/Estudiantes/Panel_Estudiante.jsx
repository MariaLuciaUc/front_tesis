import React, { useState } from 'react';
import Desafio_Estudiantes from './Desafio_Estudiantes';
import { LogOut, Check } from 'lucide-react';

const translations = {
    es: {
        logout: "Salir",
        challengeButton: "Desafío BebrasCuba - Nivel Benjamin",
        welcome: "¡Bienvenido al Desafío Bebras!",
        ready: "¿Estás listo para ponerte a prueba?",
        instruction1: "Puedes comenzar el desafío haciendo clic en el botón de la izquierda (Desafío Bebras). Cuando lo hagas, el temporizador se iniciará. Después de 45 minutos para completar la prueba.",
        instruction2: "Puedes ver las preguntas como una lista. Abra cada pregunta haciendo clic en ella.",
        instruction3: "En las preguntas de escoge, haz clic en la respuesta y luego pulsa el botón Enviar (marcado en naranja en la parte superior de la página).",
        instruction4: "En las preguntas donde debes escribir tu respuesta, escriba la letra y luego escribe el botón OK (ubicado debajo de la caja donde entrarás la respuesta). NO hagas clic en Enviar o perderás los puntos, aunque tu respuesta esté correcta.",
        instruction5: "Puedes regresar a la lista de preguntas con la fecha en la parte superior.",
        instruction6: "Cuando termines, asegúrate de que todas las tareas estén marcadas para que se evalúen con las casillas de verificación. Si eliges no evaluar una tarea, no obtendrás puntos, aunque esté correcta.",
        instruction7: "Cuando estés listo, cierra el desafío con el botón Finalizar Desafío.",
        success: "¡Éxitos!"
    },
    en: {
        logout: "Logout",
        challengeButton: "BebrasCuba Challenge - Benjamin Level",
        welcome: "Welcome to the Bebras Challenge!",
        ready: "Are you ready to test yourself?",
        instruction1: "You can start the challenge by clicking the button on the left (Bebras Challenge). When you do, the timer will start. You have 45 minutes to complete the test.",
        instruction2: "You can view the questions as a list. Open each question by clicking on it.",
        instruction3: "For multiple-choice questions, click on the answer and then press the Submit button (marked in orange at the top of the page).",
        instruction4: "For questions where you need to type your answer, type the answer and then press the OK button (located below the answer box). DO NOT click Submit or you will lose points, even if your answer is correct.",
        instruction5: "You can return to the question list using the back button at the top.",
        instruction6: "When you finish, make sure all tasks are marked to be evaluated with the checkboxes. If you choose not to evaluate a task, you will not get points even if it is correct.",
        instruction7: "When you are ready, close the challenge with the Finish Challenge button.",
        success: "Good luck!"
    },
    pt: {
        logout: "Sair",
        challengeButton: "Desafio BebrasCuba - Nível Benjamin",
        welcome: "Bem-vindo ao Desafio Bebras!",
        ready: "Você está pronto para se testar?",
        instruction1: "Você pode começar o desafio clicando no botão à esquerda (Desafio Bebras). Quando o fizer, o cronômetro será iniciado. Você terá 45 minutos para completar o teste.",
        instruction2: "Você pode ver as perguntas como uma lista. Abra cada pergunta clicando nela.",
        instruction3: "Nas questões de múltipla escolha, clique na resposta e pressione o botão Enviar (marcado em laranja no topo da página).",
        instruction4: "Nas questões em que você precisa digitar sua resposta, digite a resposta e pressione o botão OK (localizado abaixo da caixa de resposta). NÃO clique em Enviar ou você perderá pontos, mesmo se sua resposta estiver correta.",
        instruction5: "Você pode voltar à lista de perguntas usando o botão voltar no topo.",
        instruction6: "Quando terminar, certifique-se de que todas as tarefas estejam marcadas para serem avaliadas com as caixas de seleção. Se você optar por não avaliar uma tarefa, não receberá pontos, mesmo que esteja correta.",
        instruction7: "Quando estiver pronto, encerre o desafio com o botão Finalizar Desafio.",
        success: "Boa sorte!"
    },
    fr: {
        logout: "Déconnexion",
        challengeButton: "Défi BebrasCuba - Niveau Benjamin",
        welcome: "Bienvenue au Défi Bebras !",
        ready: "Êtes-vous prêt à vous mettre à l'épreuve ?",
        instruction1: "Vous pouvez commencer le défi en cliquant sur le bouton à gauche (Défi Bebras). Lorsque vous le ferez, le chronomètre démarrera. Vous disposez de 45 minutes pour terminer le test.",
        instruction2: "Vous pouvez voir les questions sous forme de liste. Ouvrez chaque question en cliquant dessus.",
        instruction3: "Pour les questions à choix multiples, cliquez sur la réponse, puis appuyez sur le bouton Envoyer (marqué en orange en haut de la page).",
        instruction4: "Pour les questions où vous devez saisir votre réponse, tapez la réponse, puis appuyez sur le bouton OK (situé sous la zone de réponse). NE cliquez PAS sur Envoyer, sinon vous perdrez des points, même si votre réponse est correcte.",
        instruction5: "Vous pouvez revenir à la liste des questions à l'aide du bouton retour en haut.",
        instruction6: "Lorsque vous avez terminé, assurez-vous que toutes les tâches sont cochées pour être évaluées avec les cases à cocher. Si vous choisissez de ne pas évaluer une tâche, vous n'obtiendrez pas de points, même si elle est correcte.",
        instruction7: "Lorsque vous êtes prêt, terminez le défi avec le bouton Terminer le défi.",
        success: "Bonne chance !"
    }
};

const Panel_Estudiante = ({ student, onLogout, language = 'es', setLanguage }) => {
    const t = translations[language];
    const [desafioIniciado, setDesafioIniciado] = useState(false);

    const handleIniciarDesafio = () => setDesafioIniciado(true);

    if (desafioIniciado) {
        return <Desafio_Estudiantes studentData={student} onBackToPanel={() => setDesafioIniciado(false)} language={language} setLanguage={setLanguage} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header con logout y selector de idioma */}
                <div className="flex justify-between items-center mb-8">
                    {/* Selector de idioma */}
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'es' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('es')}>ES</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('en')}>EN</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('pt')}>PT</button>
                        <button className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'fr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setLanguage('fr')}>FR</button>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-all"
                    >
                        <LogOut size={16} /> {t.logout}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Columna izquierda - Botón del desafío */}
                    <div>
                        <button
                            onClick={handleIniciarDesafio}
                            className="flex items-left p-5 bg-white hover:bg-orange-100 transition-colors border border-gray-200 min-h-[5px] w-full text-left cursor-pointer"
                        >
                            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <p className="text-gray-600 text-l">{t.challengeButton}</p>
                        </button>
                    </div>

                    {/* Columna derecha - Información del desafío */}
                    <div className="p-8 bg-white">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.welcome}</h3>
                        <p className="text-gray-600 mb-6">{t.ready}</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction1}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction2}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction3}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction4}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction5}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction6}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">{t.instruction7}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-800">{t.success}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Panel_Estudiante;