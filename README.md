# Dinocats - Battle System
![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)


Dinocats é um jogo de batalha inovador que mistura dinossauros com cabeças de gatos!  
Inspirado na mecânica clássica de batalhas por turnos (como Pokémon), mas trazendo **elementos únicos** que tornam cada combate imprevisível e estratégico.

---

## 🚀 Sobre o Jogo

Cada Dinocat possui atributos que influenciam diretamente o combate:

- **Personalidade**: Define o estilo de batalha do Dinocat (agressivo, cauteloso, brincalhão, estratégico, etc.).
- **Skills**: Conjunto de habilidades que cada Dinocat pode usar durante a batalha.
- **Emoções**: Estados emocionais que surgem após ações ou ao final da batalha, impactando os próximos combates (ex.: raiva aumenta ataque, tristeza reduz precisão, alegria aumenta chance crítica).

---

## 🏗️ Arquitetura do Sistema

O projeto é dividido em duas partes principais: **Backend** e **Frontend**.

### Backend (Node.js)
Segue o padrão **MCR**:
- **Config/Database** – Configurações de conexão e estrutura do banco de dados.
- **Models** – Representação dos dados e suas regras.
- **Controllers** – Lógica de negócio e manipulação de dados.
- **Routes** – Definição das rotas e conexão com os controllers.

### Frontend (React)
Organizado em:
- **components** – Componentes reutilizáveis da interface.
- **css** – Estilos e temas.
- **pages** – (Opcional) Estrutura de páginas, caso o projeto venha a crescer em rotas distintas.

---

## 📦 Estrutura do Projeto

- `/src` - Código-fonte principal do sistema de batalha.
- `/backend` - API e lógica do jogo com padrão MCR.
- `/frontend` - Interface React do jogo.
- `/assets` - Sprites, ícones e recursos visuais.
- `/docs` - Documentação técnica.
- `/tests` - Testes de mecânicas e balanceamento.

---

## ⚠️ Aviso Legal e Direitos Autorais

Este projeto é **propriedade intelectual do autor original**.  
**É expressamente proibida a venda, distribuição, sublicenciamento, reprodução comercial ou divulgação pública deste código e/ou conceito sem autorização formal por escrito do autor.**  

Ao contribuir para este repositório, você **reconhece e aceita que não adquire quaisquer direitos sobre o conceito, marca ou monetização do projeto**, a menos que haja contrato formal assinado.

---

## 🤝 Contribuindo

Quer contribuir?  
- Faça um fork do repositório.
- Crie uma branch com sua feature: `git checkout -b feature/sua-feature`.
- Envie um pull request para revisão.

> **Importante:** Alterações na branch principal (`main`) só serão feitas mediante revisão e aprovação.

---

## 📜 Licença

Licença personalizada: **Todos os direitos reservados.**  
Uso permitido apenas para fins de colaboração e aprendizado, sendo **vedada qualquer forma de exploração comercial sem autorização expressa do autor**.
