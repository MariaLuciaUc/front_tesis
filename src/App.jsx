import React from 'react';
import Activacion from "./Views/Maestros/Activacion.jsx";
import {Toaster} from "sonner";

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
      <Toaster richColors/>
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

