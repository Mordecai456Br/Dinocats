import { useState } from "react";
import '../css/login.css';

export default function Login({ onLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    // Simples validação para testar API
    const res = await fetch(`http://localhost:5000/users/${id}`);
    if (!res.ok) return showFeedback("Usuário não encontrado!");

    const user = await res.json();
    if (user.password !== password) return showFeedback("Senha incorreta!");

    onLogin(user); // Passa o usuário logado para App
  };

  const showFeedback = (message) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="login-container">
      {/* 🔹 Vídeo de fundo */}
      <video className="login-video" autoPlay loop muted playsInline>
        <source src="/app/assets/Dinocat_Animado_com_Fundo_Galactico.mp4" type="video/mp4" />
      </video>

      {/* 🔹 Camada de blur */}
      <div className="login-overlay"></div>

      {/* 🔹 Modal central */}
      <div className="login-modal">
        <div className="login-header">
          <h1>Login</h1>
          <p>Enter in your account</p>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>

        <div className="login-fields">
          <div className="login-field">
            <label>User ID:</label>
            <input
              type="number"
              placeholder="User ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="login-button" onClick={handleSubmit}>
          Join!
        </div>
      </div>
    </div>
  );
}
