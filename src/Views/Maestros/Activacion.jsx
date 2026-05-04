import React, { useState } from 'react';
import './Activacion.css';
import Gestion_grupos_estudiantes from './Gestion_grupos_estudiantes';

const Activacion = ({ onActivate, onResetPassword, onSuccess }) => {
    const [activationCode, setActivationCode] = useState('');
    const [language, setLanguage] = useState('es');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedEmails, setAcceptedEmails] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);

    const handleVerifyCode = () => {
        if (activationCode === 'BEBRASCUBA112025') {
            setStep(2);
        } else {
            alert('Código de activación incorrecto');
        }
    };

    const handleNextStep = () => {
        // Validaciones
        if (step === 3 && (!email || !password)) {
            alert('Complete su correo electrónico y contraseña');
            return;
        }
        if (step === 4 && !acceptedTerms) {
            alert('Debe aceptar los términos de servicio');
            return;
        }

        if (step === 4) {
            setStep(5);
            return;
        }

        if (step === 5) {
            // Llamar a onActivate si existe
            if (onActivate) {
                onActivate({ email, password, activationCode });
            }

            if (onSuccess) {
                console.log('Llamando a onSuccess para navegar al dashboard');
                onSuccess();
            }

            // Mostrar el componente de gestión de grupos/estudiantes
            setShowDashboard(true);
            return;
        }

        setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step > 2) setStep(step - 1);
    };

    const handleResetPassword = () => {
        if (email) {
            if (onResetPassword) onResetPassword(email);
            alert('Se ha enviado un enlace para restablecer su contraseña');
        } else {
            alert('Primero ingrese su correo electrónico');
        }
    };

    // Si showDashboard es true, mostrar Gestion_grupos_estudiantes
    if (showDashboard) {
        return <Gestion_grupos_estudiantes />;
    }

    return (
        <div className="activacion-container">
            <div className="v-activacion">
                {/* Selector de idioma */}
                <div className="language-selector-activacion">
                    <button
                        className={language === 'es' ? 'lang-active' : ''}
                        onClick={() => setLanguage('es')}
                    >
                        🇪🇸 Español
                    </button>
                    <button
                        className={language === 'en' ? 'lang-active' : ''}
                        onClick={() => setLanguage('en')}
                    >
                        🇬🇧 English
                    </button>
                </div>

                {/* Paso 1: Ingresar código */}
                {step === 1 && (
                    <>
                        <h2 className="etq-activacion">Activación</h2>
                        <label>Código de activación</label>
                        <input
                            type="text"
                            value={activationCode}
                            onChange={(e) => setActivationCode(e.target.value)}
                            placeholder="Ingrese el código"
                        />
                        <div className="action-buttons-activacion">
                            <button className="btn-confirmar" onClick={handleVerifyCode}>
                                Confirmar
                            </button>
                        </div>
                        <div className="opciones-adicionales">
                            <button className="btn-link" onClick={() => setStep(3)}>
                                ¿Olvidó su contraseña? Restablecer
                            </button>
                        </div>
                    </>
                )}

                {/* Paso 2: Nueva activación */}
                {step === 2 && (
                    <>
                        <h2 className="etq-activacion">Nueva activación</h2>
                        <div className="descripcion-texto">
                            <p>Descripción (1/4): El desafío Bebras es un concurso internacional de pensamiento computacional...</p>
                        </div>
                        <div className="action-buttons-activacion">
                            <button className="btn-siguiente" onClick={handleNextStep}>
                                Siguiente página →
                            </button>
                        </div>
                        <div className="opciones-adicionales">
                            <button className="btn-link" onClick={() => setStep(1)}>
                                ← Volver
                            </button>
                        </div>
                    </>
                )}

                {/* Paso 3: Email y contraseña */}
                {step === 3 && (
                    <>
                        <h2 className="etq-activacion">Datos de cuenta (2/4)</h2>
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="suemail@ejemplo.com"
                        />
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Cree una contraseña"
                        />
                        <div className="action-buttons-activacion">
                            <button className="btn-atras" onClick={handlePrevStep}>
                                ← Atrás
                            </button>
                            <button className="btn-siguiente" onClick={handleNextStep}>
                                Siguiente página →
                            </button>
                        </div>
                    </>
                )}

                {/* Paso 4: Términos de servicio */}
                {step === 4 && (
                    <>
                        <h2 className="etq-activacion">Términos de servicio (3/4)</h2>
                        <div className="terminos-container">
                            <p>Lea los términos de servicio...</p>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                Acepto los términos de servicio
                            </label>
                        </div>
                        <div className="action-buttons-activacion">
                            <button className="btn-atras" onClick={handlePrevStep}>
                                ← Atrás
                            </button>
                            <button className="btn-siguiente" onClick={handleNextStep}>
                                Siguiente página →
                            </button>
                        </div>
                    </>
                )}

                {/* Paso 5: Confirmación */}
                {step === 5 && (
                    <>
                        <h2 className="etq-activacion">Confirmar datos (4/4)</h2>
                        <div className="confirmacion-datos">
                            <p><strong>Correo:</strong> {email}</p>
                            <p><strong>Contraseña:</strong> ••••••••</p>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={acceptedEmails}
                                    onChange={(e) => setAcceptedEmails(e.target.checked)}
                                />
                                Acepto recibir correos de activación e información de cuentas
                            </label>
                        </div>
                        <div className="action-buttons-activacion">
                            <button className="btn-atras" onClick={handlePrevStep}>
                                ← Atrás
                            </button>
                            <button className="btn-activar" onClick={handleNextStep}>
                                Activar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Activacion;