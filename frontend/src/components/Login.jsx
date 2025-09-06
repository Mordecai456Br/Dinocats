import { useState } from "react";

export default function Login({ onLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simples validação para testar API
    const res = await fetch(`http://localhost:5000/users/${id}`);
    if (!res.ok) return alert("Usuário não encontrado!");

    const user = await res.json();
    if (user.password !== password) return alert("Senha incorreta!");

    onLogin(user); // Passa o usuário logado para App
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="User ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
