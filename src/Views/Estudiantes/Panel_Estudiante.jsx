import React, { useState } from 'react';
import Desafio_Estudiantes from './Desafio_Estudiantes';
import {LogOut, Check, CircleDot, LucideCircleAlert, CircleX} from 'lucide-react';

const Panel_Estudiante = ({ student, onLogout }) => {
    const [desafioIniciado, setDesafioIniciado] = useState(false);

    const handleIniciarDesafio = () => setDesafioIniciado(true);

    if (desafioIniciado) {
        return <Desafio_Estudiantes studentData={student} onBackToPanel={() => setDesafioIniciado(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header con logout */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-all"
                    >
                        <LogOut size={16} /> Salir
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Columna izquierda */}

                    <div>
                        <button
                            onClick={handleIniciarDesafio}
                            className="flex  items-left p-5 bg-white hover:bg-orange-100 transition-colors border border-gray-200 min-h-[5px] w-full text-left cursor-pointer"
                        >
                            <CircleDot size={18} color="orange"/>
                            <p className="text-gray-600 text-l pl-8"> Desafio BebrasCuba - Nivel Benjamin</p>

                        </button>
                    </div>


                    {/* Columna derecha - Información del desafío */}
                    <div className="p-8 bg-white">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido al Desafío Bebras!</h3>
                        <p className="text-gray-600 mb-6">¿Estás listo para ponerte a prueba?</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">Puedes comenzar el desafío haciendo clic en el botón de la izquierda (Desafío Bebras). Cuando lo hagas, el temporizador se iniciará. Después de 45 minutos para completar la prueba.</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">Puedes ver las preguntas como una lista. Abra cada pregunta haciendo clic en ella.</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">En las preguntas de escoge, haz clic en la respuesta y luego pulsa el botón Enviar (marcado en naranja en la parte superior de la página).</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">En las preguntas donde debes escribir tu respuesta, escriba la letra y luego escribe el botón OK (ubicado debajo de la caja donde entrarás la respuesta). NO hagas clic en Enviar o perderás los puntos, aunque tu respuesta esté correcta.</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">Puedes regresar a la lista de preguntas con la fecha en la parte superior.</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">Cuando termines, asegúrate de que todas las tareas estén marcadas para que se evalúen con las casillas de verificación. Si eliges no evaluar una tarea, no obtendrás puntos, aunque esté correcta.</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-gray-700">Cuando estés listo, cierra el desafío con el botón Finalizar Desafío.</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-800">¡Éxitos!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Panel_Estudiante;