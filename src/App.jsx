import React, { useState } from 'react';
import Login_Estudiante from './Views/Estudiantes/Login_Estudiante';
import Panel_Estudiante from './Views/Estudiantes/Panel_Estudiante';
import Activacion from "./Views/Maestros/Activacion.jsx";
import Gestion_grupos_estudiantes from "./Views/Maestros/Gestion_grupos_estudiantes.jsx";

function App() {
   /* const [logueado, setLogueado] = useState(false);
    const [estudiante, setEstudiante] = useState(null);

    const iniciarSesion = (usuario, password) => {
        console.log('Usuario:', usuario, 'Password:', password);

        if (usuario && password) {
            setEstudiante({ name: usuario, username: usuario });
            setLogueado(true);
        }
    };

    const cerrarSesion = () => {
        setLogueado(false);
        setEstudiante(null);
    };*/

    return (
        <div>
            {/*!logueado ? (
                <Login_Estudiante onLogin={iniciarSesion} />
            ) : (
                <Panel_Estudiante student={estudiante} onLogout={cerrarSesion} />
            )*/}
            <Activacion/>
        </div>
    );
}

export default App;

