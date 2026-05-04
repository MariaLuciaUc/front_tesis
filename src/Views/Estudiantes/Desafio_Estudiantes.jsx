import React, { useState, useEffect } from 'react';
import './Desafio_Estudiantes.css';

const Desafio_Estudiantes = (props) => {
    const { studentData, onBackToPanel } = props;
    const [name] = useState(studentData?.name || 'Estudiante');
    const [code, setCode] = useState(studentData?.code || '');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Ya está autenticado
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState({});
    const [evaluated, setEvaluated] = useState({});
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);


    //Se tomaron estas preguntas a modo de prueba para ver como se veia el componente, luego se integrará con las tareas Bebras
    const questions = [
        {
            id: 1,
            text: "🧩 Los castores construyen un puente con 3 troncos rojos y 2 azules. ¿Cuántos troncos usan en total?",
            type: "number",
            answer: "5"
        },
        {
            id: 2,
            text: "🐾 Un castor puede transportar 2 ramas por viaje. Si necesita mover 9 ramas, ¿cuántos viajes debe hacer?",
            type: "number",
            answer: "5"
        },
        {
            id: 3,
            text: "📊 Observa la secuencia: 🔴🟡🔴🟡🔴... ¿De qué color es la posición 10?",
            type: "text",
            answer: "amarillo"
        },
        {
            id: 4,
            text: "🗺️ En el mapa del bosque, cada camino tiene 3 intersecciones. Si hay 4 caminos, ¿cuántas intersecciones hay en total?",
            type: "number",
            answer: "12"
        },
        {
            id: 5,
            text: "🕒 Si un castor tarda 5 minutos en talar un árbol, ¿cuántos minutos tardará en talar 4 árboles?",
            type: "number",
            answer: "20"
        }
    ];

    useEffect(() => {
        if (timeLeft > 0 && !finished) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !finished) {
            handleFinalizar();
        }
    }, [timeLeft, finished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (value) => {
        setAnswers({ ...answers, [currentQuestion]: value });
    };

    const handleSubmitQuestion = () => {
        if (!answers[currentQuestion]) {
            alert('✏️ ¡Escribe tu respuesta antes de enviar!');
            return;
        }
        setSubmitted({ ...submitted, [currentQuestion]: true });
    };

    const toggleEvaluate = (qIndex) => {
        setEvaluated(prev => ({ ...prev, [qIndex]: !prev[qIndex] }));
    };

    const handleFinalizar = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (evaluated[idx] && answers[idx]) {
                const userAnswer = answers[idx].toString().toLowerCase().trim();
                const correctAnswer = q.answer.toString().toLowerCase().trim();
                if (userAnswer === correctAnswer) {
                    score++;
                }
            }
        });
        setFinalScore(score);
        setFinished(true);
        setShowFinishModal(false);
    };

    const handleExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        if (onBackToPanel) {
            onBackToPanel();
        }
    };

    // Pantalla de resultados finales
    if (finished) {
        return (
            <div className="login-estudiante-container">
                <div className="v-login-estudiante result-container">
                    <div className="etq-login">
                        🏆 ¡Desafío completado! 🏆
                    </div>
                    <div className="qr-info result-info">
                        <div>✨ {name}, ¡lo hiciste increíble! ✨</div>
                        <div className="final-score">
                            {finalScore} / {questions.length}
                        </div>
                        {finalScore === questions.length ? (
                            <div className="result-message perfect">🎉 ¡Perfecto! Eres un genio castor 🎉</div>
                        ) : finalScore >= questions.length / 2 ? (
                            <div className="result-message good">👍 ¡Buen trabajo! Sigue así 👍</div>
                        ) : (
                            <div className="result-message try-again">💪 ¡No te rindas! La práctica hace al maestro 💪</div>
                        )}
                    </div>
                    <button className="btn-ingresar" onClick={onBackToPanel}>
                        📋 Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="desafio-principal-container">
            <div className="desafio-header">
                <div className="header-title">🎯 Desafío Bebras</div>
                <div className="header-timer">⏱️ {formatTime(timeLeft)}</div>
                <div className="header-user">👩‍🎓 {name}</div>
                <button className="header-exit-btn" onClick={handleExit}>
                    Salir
                </button>
                <button className="header-finish-btn" onClick={() => setShowFinishModal(true)}>
                    🏁 Finalizar Desafío
                </button>
            </div>

            <div className="desafio-content">
                {/* Lista de preguntas */}
                <div className="questions-list-panel">

                    {questions.map((q, idx) => (
                        <div
                            key={q.id}
                            className={`question-item ${currentQuestion === idx ? 'active' : ''}`}
                            onClick={() => setCurrentQuestion(idx)}
                        >
                            <div className="question-item-header">
                                <span className="question-number">Pregunta {idx + 1}</span>
                                <div className="question-status">
                                    {submitted[idx] && <span className="submitted-badge">✅ Enviada</span>}
                                    <label className="evaluate-label">
                                        <input
                                            type="checkbox"
                                            checked={!!evaluated[idx]}
                                            onChange={() => toggleEvaluate(idx)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        Evaluar
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="info-note">
                        💡 Marca "Evaluar" solo las preguntas que quieras que cuenten para tu puntaje
                    </div>
                </div>

                {/* Área de pregunta actual */}
                <div className="question-panel">
                    <h2 className="question-title">📌 Pregunta {questions[currentQuestion].id}</h2>
                    <div className="question-text">
                        {questions[currentQuestion].text}
                    </div>

                    <div className="answer-area">
                        <label className="answer-label">✍️ Tu respuesta:</label>
                        <input
                            type="text"
                            className="answer-input"
                            value={answers[currentQuestion] || ''}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder="Escribe aquí tu respuesta..."
                        />
                        <div className="answer-actions">
                            <button className="submit-answer-btn" onClick={handleSubmitQuestion}>
                                📨 Enviar respuesta
                            </button>
                            {submitted[currentQuestion] && (
                                <span className="success-message">✅ ¡Respuesta guardada!</span>
                            )}
                        </div>
                    </div>

                    {/* Navegación */}
                    <div className="navigation-buttons">
                        <button
                            className="nav-btn"
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                        >
                            ◀ Anterior
                        </button>
                        <span className="page-counter">{currentQuestion + 1} / {questions.length}</span>
                        <button
                            className="nav-btn"
                            disabled={currentQuestion === questions.length - 1}
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                        >
                            Siguiente ▶
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de finalización */}
            {showFinishModal && (
                <div className="modal-overlay" onClick={() => setShowFinishModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">🔔 ¿Finalizar desafío?</h3>
                        <p className="modal-text">
                            Recuerda marcar con ✓ las preguntas que quieres evaluar.
                            Las no evaluadas no sumarán puntos.
                        </p>
                        <div className="modal-buttons">
                            <button className="modal-cancel-btn" onClick={() => setShowFinishModal(false)}>
                                ❌ Cancelar
                            </button>
                            <button className="modal-confirm-btn" onClick={handleFinalizar}>
                                ✅ Sí, finalizar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de salida */}
            {showExitModal && (
                <div className="modal-overlay" onClick={() => setShowExitModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">🚪 ¿Salir del desafío?</h3>
                        <p className="modal-text">
                            Si sales ahora, perderás todo tu progreso. ¿Estás seguro?
                        </p>
                        <div className="modal-buttons">
                            <button className="modal-cancel-btn" onClick={() => setShowExitModal(false)}>
                                ❌ Seguir en el desafío
                            </button>
                            <button className="modal-confirm-btn exit" onClick={confirmExit}>
                                ✅ Sí, salir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Desafio_Estudiantes;