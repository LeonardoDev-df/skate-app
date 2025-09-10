#!/bin/bash

echo "🧪 Testando Skateparks Corrigidos"
echo "================================="

BASE_URL="http://localhost:3001"

echo -e "\n1. 🔍 Debug - Dados brutos do Firebase"
curl -s "$BASE_URL/skateparks/debug"

echo -e "\n\n2. 🏞️ Todos os skateparks"
curl -s "$BASE_URL/skateparks"

echo -e "\n\n3. 🏞️ Buscar por 'Brasilia' (sem acento)"
curl -s "$BASE_URL/skateparks?city=Brasilia"

echo -e "\n\n4. 🏞️ Buscar por 'Brasília' (com acento)"
curl -s "$BASE_URL/skateparks?city=Brasília"

echo -e "\n\n5. 🏞️ Buscar por 'brasilia' (minúsculo)"
curl -s "$BASE_URL/skateparks?city=brasilia"

echo -e "\n\n6. 🏞️ Buscar por 'DF'"
curl -s "$BASE_URL/skateparks?city=DF"

echo -e "\n\n7. ��️ Buscar por 'Paranoá'"
curl -s "$BASE_URL/skateparks?city=Paranoa"

echo -e "\n\n8. ��️ Buscar por 'Deck'"
curl -s "$BASE_URL/skateparks?city=Deck"

echo -e "\n\n9. ��️ Rota específica: /city/Brasilia"
curl -s "$BASE_URL/skateparks/city/Brasilia"

echo -e "\n\n10. 🎯 Skatepark específico"
curl -s "$BASE_URL/skateparks/rrpDJ2CRrrskTQ0hx97o_0"

echo -e "\n\n✅ Testes concluídos!"