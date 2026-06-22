import Activacion from "./Views/Maestros/Activacion.jsx";
import {Toaster} from "sonner";
import Panel_Coordinador_Nacional from "./Views/Coordinador_Nacional/Panel_Coordinador_Nacional.jsx";
import Panel_Estudiante from "./Views/Estudiantes/Panel_Estudiante.jsx";
import Gestion_grupos_estudiantes from "./Views/Maestros/Gestion_grupos_estudiantes.jsx";

function App() {
  return (
    <div>
      <Toaster richColors/>
        <Panel_Estudiante/>
    </div>
  );
}

export default App