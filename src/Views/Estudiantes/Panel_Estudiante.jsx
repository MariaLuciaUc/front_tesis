import React, { useState } from 'react';
import './Panel_Estudiante.css';
import Desafio_Estudiantes from './Desafio_Estudiantes';

const Panel_Estudiante = (props) => {
    const { student, onLogout } = props;
    const [desafioIniciado, setDesafioIniciado] = useState(false);
    const handleIniciarDesafio = () => {
        setDesafioIniciado(true);
    };

    // Si el desafío se inicio, mostrar el componente Desafio_Estudiantes
    if (desafioIniciado) {
        return <Desafio_Estudiantes studentData={student} onBackToPanel={() => setDesafioIniciado(false)} />;
    }

    return (
        <div className="panel-container">
            <div className="v-panel">
                <div className="panel-header">
                    <h2 className="etq-panel">¡Bienvenido al Desafío Bebras 🧮!</h2>
                </div>

                <div className="info-desafio">
                    <p>¿Estás listo para ponerte a prueba?</p>
                    <p>Puedes comenzar el desafío haciendo clic en el botón de abajo (Comenzar desafío). cuando lo hagas, el temporizador se iniciará.</p>
                    <p>Dispones de 45 minutos para comenzar la prueba.</p>
                    <p>Puedes ver las preguntas como una lista. Abre cada pregunta haciendo clic en ella.</p>
                    <p>En las preguntas de seleccionar, haz clic en la respuesta y luego pulsa en el botón Enviar Respuesta que se encuentra debajo de cada pregunta. </p>
                    <p>En las preguntas donde debes escribir tu respuesta, escríbela y luego oprime el botón Enviar Respuesta.</p>
                    <p>En las preguntas de arrastrar, toma el elemento con un clic sostenido y llevalo hacia el lugar donde usted crea que se corresponda.</p>
                    <p>Cuando termines, asegúrate de que todas las tareas estén marcadas para que se evalúen con las casillas de verificación. Si no eliges evaluar una tarea, no obtendrás puntos aunque no esté correcta.</p>
                    <p>Cuando estés listo, cierra el desafío con el botón <strong>Finalizar Desafío</strong></p>
                    <p>¡Éxitos!</p>
                    <p><strong>📋 Preguntas:</strong> 6</p>
                    <p><strong>⏰ Tiempo:</strong> 45 minutos</p>
                    <p><strong>🎯 Puntaje máximo:</strong> 100 puntos</p>
                </div>

                <div className="start-section">
                    <button className="btn-iniciar" onClick={handleIniciarDesafio}>
                        🚀 Comenzar desafío
                    </button>
                    <button className="btn-cerrar" onClick={onLogout}>
                        🔒 Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Panel_Estudiante;