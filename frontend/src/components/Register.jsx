import { useState } from "react";
import '../css/register.css';

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !birthday || !password) {
      setFeedback("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthday, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setFeedback(errorData.message || "Erro ao registrar!");
        return;
      }

      const user = await res.json();
      onRegister(user);
    } catch (err) {
      setFeedback("Erro ao conectar com o servidor!");
      console.error(err);
    }
  };

  return (
    
    <div className="register-container">
      {/* Vídeo de fundo */}
      <video autoPlay loop muted playsInline className="register-video">
        <source src="/app/assets/Dinocat_Animado_com_Fundo_Galactico.mp4" type="video/mp4" />
      </video>

      {/* Camada de blur */}
      <div className="register-overlay"></div>

      {/* Modal central */}
      <form className="register-modal" onSubmit={handleSubmit}>
        <div className="register-header">
          <h1>Register</h1>
          <p>Create your account</p>
          {feedback && <p className="register-feedback">{feedback}</p>}
        </div>

        <div className="register-fields">
          <div className="register-field">
            <label>Display Name</label>
            <input
              type="text"
              placeholder="thisismyname404"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label>Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
    
  );
}
