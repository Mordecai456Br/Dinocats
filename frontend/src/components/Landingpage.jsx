import { useState } from "react";
import '../css/landingpage.css';

export default function Landingpage({ navigate }) {
    // Função chamada ao clicar em "Login"
    const handleLoginClick = () => {
        if (navigate) navigate('/login');
    };

    // Função chamada ao clicar em "Register"
    const handleRegisterClick = () => {
        if (navigate) navigate('/register');

    };

    return (
        <div className="landpage">
            <video autoPlay
                loop
                muted
                playsInline
                className="background-video"><source src="/app/assets/Dinocat_Animado_com_Fundo_Galactico.mp4" type="video/mp4" />

            </video>
            <div className="buttons">
                <div className="login" onClick={handleLoginClick}>
                    <div className="landpage-login">
                        <div className="login2">Login</div>
                    </div>
                </div>

                <div className="login" onClick={handleRegisterClick}>
                    <div className="landpage-login">
                        <div className="login2">Register</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
