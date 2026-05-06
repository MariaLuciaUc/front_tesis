import React, {useState} from 'react';
import Activacion from "./Views/Maestros/Activacion.jsx";
import {Toaster} from "sonner";
import Login_Estudiante from "./Views/Estudiantes/Login_Estudiante.jsx";

function App() {


  return (
    <div>
      <Toaster richColors/>
        <Login_Estudiante/>
        {/*<Activacion/>*/}
    </div>
  );
}

export default App;

