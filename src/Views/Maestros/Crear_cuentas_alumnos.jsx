import React, {useState} from 'react';
import './Crear_cuentas_alumnos.css'

export default function Crear_cuentas_alumnos({ onStudentsCreated, onCancel }) {
    const [nombres, setNombres] = useState('');
    const [listaNombres, setListaNombres] = useState([]);
    const [genero, setGenero] = useState('Femenino');
    const [enviarCorreo, setEnviarCorreo] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);

    // Procesar los nombres del textarea
    const procesarNombres = () => {
        const nombresArray = nombres
            .split('\n')
            .map(nombre => nombre.trim())
            .filter(nombre => nombre !== '');

        if (nombresArray.length === 0) {
            setMensaje('⚠️ Por favor, ingrese al menos un nombre');
            return;
        }

        setListaNombres(nombresArray);
        setMostrarVistaPrevia(true);
        setMensaje(`✅ ${nombresArray.length} nombre(s) procesado(s) correctamente`);
    };

    // Guardar y enviar los estudiantes al componente padre
    const guardarYEnviar = () => {
        if (listaNombres.length === 0) {
            setMensaje('⚠️ No hay nombres para guardar. Use "Procesar Nombres" primero');
            return;
        }

        // Enviar los estudiantes creados al componente padre
        if (onStudentsCreated) {
            onStudentsCreated(listaNombres, genero, enviarCorreo);
        }
    };

    const limpiarTodo = () => {
        setNombres('');
        setListaNombres([]);
        setMostrarVistaPrevia(false);
        setMensaje('');
    };

    const cerrarModal = () => {
        limpiarTodo();
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="crear-cuentas-container">
            <div className="header">
                <label className="titulo">Crear cuentas nuevas</label>
                <button className="btn-cerrar" onClick={cerrarModal}>Cerrar</button>
            </div>

            <div className="nombres-section">
                <label className="subtitulo">Ingrese los nombres (uno por línea):</label>
                <textarea
                    className="textarea-nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Ejemplo:&#10;Ana García&#10;María López&#10;Carmen Rodríguez"
                    rows={8}
                />
                <button className="btn-procesar" onClick={procesarNombres}>
                    Procesar Nombres
                </button>
            </div>

            <div className="genero-section">
                <label>Género:</label>
                <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                </select>
            </div>

            <div className="correo-section">
                <input
                    type="checkbox"
                    id="correoCheckbox"
                    checked={enviarCorreo}
                    onChange={(e) => setEnviarCorreo(e.target.checked)}
                />
                <label htmlFor="correoCheckbox">
                    Enviar nuevas cuentas al correo electrónico dgalvezlio@outlook.com
                </label>
            </div>
            <div className="acciones-section">
                <button className="btn-guardar" onClick={guardarYEnviar}>
                    Guardar y Agregar Estudiantes
                </button>
                <button className="btn-limpiar" onClick={limpiarTodo}>
                    Limpiar todo
                </button>
            </div>

            {mensaje && (
                <div className="mensaje">
                    {mensaje}
                </div>
            )}

            {mostrarVistaPrevia && listaNombres.length > 0 && (
                <div className="vista-previa">
                    <h4>📋 Vista Previa ({listaNombres.length} nombre(s)):</h4>
                    <div className="lista-nombres">
                        {listaNombres.map((nombre, index) => (
                            <div key={index} className="nombre-item">
                                {index + 1}. {nombre}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}