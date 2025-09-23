#!/bin/bash
set -e  # Para o script se ocorrer qualquer erro

echo "🔹 Instalando dependências do backend..."
cd backend
npm install

echo "🔹 Instalando dependências do frontend..."
cd ../frontend
npm install

echo "🔹 Build do frontend..."
npm run build

echo "🔹 Servindo frontend pelo backend..."
cd ../backend
npm start
