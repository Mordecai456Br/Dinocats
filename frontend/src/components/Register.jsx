import { useState } from "react";   

export default function RegisterPage({ onRegisterSucess }) {
    const [formData, setFormData] = useState({
        name: "",
        birthday: "",
        cpf: '',
        password: "",
    });
}

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        consolelog('formulário para se registrar:', formData);
        alert('Usuário  ${formData.name} registrado com sucesso!');
        onRegisterSucess(formData);
    }

    return (
    <div>
      <h2>Página de Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome Completo:</label>
          <input
            type="text"
            id="name"
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="birthday">Data de Nascimento:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crie uma senha forte"
            required
          />
        </div>
        <br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );

