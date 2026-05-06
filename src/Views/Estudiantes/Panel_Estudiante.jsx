import React, { useState } from 'react';
import Desafio_Estudiantes from './Desafio_Estudiantes';
import { Play, LogOut, Clock, Target, Award, List, CheckCircle, AlertCircle, BookOpen, Medal, Rocket, Flag } from 'lucide-react';

const Panel_Estudiante = ({ student, onLogout }) => {
    const [desafioIniciado, setDesafioIniciado] = useState(false);

    const handleIniciarDesafio = () => setDesafioIniciado(true);

    if (desafioIniciado) {
        return <Desafio_Estudiantes studentData={student} onBackToPanel={() => setDesafioIniciado(false)} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 animate-[fadeInUp_.4s_ease-out]">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Rocket size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800">¡Bienvenido, {student?.name || 'Estudiante'}!</h2>
                    <p className="text-slate-500 mt-2">¿Estás listo para ponerte a prueba?</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 mb-6 space-y-3 max-h-96 overflow-y-auto">
                    <p className="text-slate-700 text-sm flex items-start gap-2"><Play size={14} className="text-blue-500 mt-0.5" /> Puedes comenzar el desafío haciendo clic en el botón de abajo. Cuando lo hagas, el temporizador se iniciará.</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><Clock size={14} className="text-blue-500 mt-0.5" /> Dispones de <strong>45 minutos</strong> para completar la prueba.</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><List size={14} className="text-blue-500 mt-0.5" /> Puedes ver las preguntas como una lista. Abre cada pregunta haciendo clic en ella.</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><CheckCircle size={14} className="text-blue-500 mt-0.5" /> En las preguntas de seleccionar, haz clic en la respuesta y luego pulsa en el botón <strong>Enviar Respuesta</strong>.</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><AlertCircle size={14} className="text-blue-500 mt-0.5" /> En las preguntas donde debes escribir tu respuesta, escríbela y luego oprime el botón <strong>Enviar Respuesta</strong>.</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><Target size={14} className="text-blue-500 mt-0.5" /> Cuando termines, asegúrate de que todas las tareas estén marcadas para que se evalúen con las casillas de verificación. Si no eliges evaluar una tarea, no obtendrás puntos.</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><Flag size={14} className="text-green-500 mt-0.5" /> Cuando estés listo, cierra el desafío con el botón <strong>Finalizar Desafío</strong></p>
                    <p className="text-slate-700 text-sm pt-2 font-semibold">¡Éxitos!</p>

                    <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-sm"><List size={14} className="text-slate-400" /> <strong>Preguntas:</strong> 6</div>
                        <div className="flex items-center gap-2 text-sm"><Clock size={14} className="text-slate-400" /> <strong>Tiempo:</strong> 45 minutos</div>
                        <div className="flex items-center gap-2 text-sm"><Medal size={14} className="text-slate-400" /> <strong>Puntaje máximo:</strong> 100 puntos</div>
                        <div className="flex items-center gap-2 text-sm"><Award size={14} className="text-slate-400" /> <strong>Nivel:</strong> Bebras</div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={handleIniciarDesafio} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-lg">
                        <Play size={18} /> Comenzar desafío
                    </button>
                    <button onClick={onLogout} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-all">
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <BookOpen size={12} /> Desafío Internacional de Pensamiento Computacional - Bebras
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Panel_Estudiante;