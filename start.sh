#!/bin/bash

# --- Backend ---
echo "🔹 Instalando dependências do backend..."
cd backend
npm install

echo "🔹 Rodando build backend (se houver)..."
# Se quiser adicionar build steps para backend, coloque aqui

# --- Frontend ---
echo "🔹 Instalando dependências do frontend..."
cd ../frontend
npm install

echo "🔹 Build do frontend..."
npm run build

# --- Servir frontend pelo backend ---
echo "🔹 Servindo frontend pelo backend..."
cd ../backend
# Certifique-se de que o backend serve os arquivos estáticos
# (veja abaixo como configurar)
npm start
