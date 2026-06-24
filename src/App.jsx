// src/App.jsx
import React from 'react';
import { useMockAuth } from './hooks/useMockAuth';
import Panel_Coordinador_Nacional from './Views/Coordinador_Nacional/Panel_Coordinador_Nacional';
import Panel_Estudiante from './Views/Estudiantes/Panel_Estudiante';
import Gestion_grupos_estudiantes from './Views/Maestros/Gestion_grupos_estudiantes';
import {Toaster} from "sonner";

function App() {
    const { user, role, loading, isCoordinator, isTeacher, isStudent } = useMockAuth();

    if (loading) {
        return (

            <div className="flex items-center justify-center h-screen">

                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">


            {isCoordinator && <Panel_Coordinador_Nacional />}
            {isTeacher && <Gestion_grupos_estudiantes />}
            {isStudent && <Panel_Estudiante onLogout={() => window.location.reload()} />}

            {!isCoordinator && !isTeacher && !isStudent && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-600">Sin rol asignado</h2>
                        <p className="text-gray-500 mt-2">Configura un rol en mock/config.json</p>
                        <p className="text-xs text-gray-400 mt-4">
                            Roles: coordinator, teacher, student
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;