#!/bin/bash

echo "🧪 Testando Backend do Skate App (sem jq)"
echo "=========================================="

BASE_URL="http://localhost:3001"

echo -e "\n�� ENDPOINTS PÚBLICOS"
echo "======================================"

echo -e "\n1. 🏥 Health Check"
echo "Response:"
curl -s "$BASE_URL/health"

echo -e "\n\n2. 🏞️ Skateparks - Todos"
echo "Response:"
curl -s "$BASE_URL/skateparks"

echo -e "\n\n3. 🏞️ Skateparks - Por Cidade"
echo "Response:"
curl -s "$BASE_URL/skateparks?city=Brasilia"

echo -e "\n\n🔒 ENDPOINTS PROTEGIDOS (devem dar erro 401)"
echo "=============================================="

echo -e "\n4. 🚫 Users (sem auth)"
echo "Response:"
curl -s "$BASE_URL/users"

echo -e "\n\n5. 🚫 Auth Profile (sem token)"
echo "Response:"
curl -s "$BASE_URL/auth/profile"

echo -e "\n\n✅ Todos os endpoints testados!"
echo "📚 Documentação: $BASE_URL/api/docs"