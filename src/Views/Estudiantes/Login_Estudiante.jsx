import React, { useState } from 'react';
import './Login_Estudiante.css';
import castorcubasi from '/src/castorcubasi.jpg';

const Login_Estudiante = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Ingresa usuario y contraseña');
            return;
        }
        props.onLogin(username, password);
    };

    return (
        <div className="login-estudiante-container">
            <div className="v-login-estudiante">
                <h2 className="etq-login">Bienvenido al Desafío Bebras</h2>
                <img src="" alt=""/>
                <div className="qr-info">
                    <div className="qr-placeholder"></div>
                    <img src={castorcubasi}/>
                    <p> Ingresa tus credenciales</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-ingresar">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login_Estudiante;