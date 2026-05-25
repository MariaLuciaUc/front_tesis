import React, {useState} from 'react';
import Activacion from "./Views/Maestros/Activacion.jsx";
import {Toaster} from "sonner";
import Login_Estudiante from "./Views/Estudiantes/Login_Estudiante.jsx";
import Pregunta from "./Views/Estudiantes/Pregunta.jsx";

function App() {


  return (
    <div>
      <Toaster richColors/>
        <Login_Estudiante/>

        {/*<Login_Estudiante/>*/}
    </div>
  );
}

export default App;

//por el momento para las vistas de los estudiantes componente <Login_Estudiante/> y para la de los maestros <Activacion/>