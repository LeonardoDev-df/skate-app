#!/bin/bash

echo "🧪 Testando TODOS os Endpoints do Skate App Backend"
echo "=================================================="

BASE_URL="http://localhost:3001"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}📋 ENDPOINTS PÚBLICOS${NC}"
echo "======================================"

echo -e "\n${YELLOW}1. 🏥 Health Check${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/health")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 200 ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo $body | jq '.'
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo $body
fi

echo -e "\n${YELLOW}2. 🔥 Firebase Test${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/firebase-test")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 200 ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo $body | jq '.status, .collections | keys'
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo $body
fi

echo -e "\n${YELLOW}3. 🏞️ Skateparks - Todos${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/skateparks")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 200 ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo $body | jq '.count, .skateparks[0]'
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo $body
fi

echo -e "\n${YELLOW}4. 🏞️ Skateparks - Por Cidade${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/skateparks?city=Brasilia")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 200 ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo $body | jq '.count'
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo $body
fi

echo -e "\n${BLUE}🔒 ENDPOINTS PROTEGIDOS (sem token - devem dar erro 401)${NC}"
echo "=========================================================="

echo -e "\n${YELLOW}5. 🚫 Users (sem auth)${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/users")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 401 ]; then
    echo -e "${GREEN}✅ Status: $http_code (correto - não autorizado)${NC}"
    echo $body | jq '.'
else
    echo -e "${RED}❌ Status: $http_code (deveria ser 401)${NC}"
    echo $body
fi

echo -e "\n${YELLOW}6. 🚫 Auth Profile (sem token)${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/auth/profile")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 401 ]; then
    echo -e "${GREEN}✅ Status: $http_code (correto - não autorizado)${NC}"
    echo $body | jq '.'
else
    echo -e "${RED}❌ Status: $http_code (deveria ser 401)${NC}"
    echo $body
fi

echo -e "\n${YELLOW}7. 🚫 Monitoring (sem token)${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/monitoring/stats")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

if [ $http_code -eq 401 ]; then
    echo -e "${GREEN}✅ Status: $http_code (correto - não autorizado)${NC}"
    echo $body | jq '.'
else
    echo -e "${RED}❌ Status: $http_code (deveria ser 401)${NC}"
    echo $body
fi

echo -e "\n${BLUE}🔄 RATE LIMITING TEST${NC}"
echo "========================="

echo -e "\n${YELLOW}8. 🔐 Rate Limiting (6 tentativas de login)${NC}"
for i in {1..6}; do
    echo -n "Tentativa $i: "
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"idToken":"token_invalido"}')
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ $http_code -eq 429 ]; then
        echo -e "${YELLOW}Status: $http_code (Rate Limited)${NC}"
    elif [ $http_code -eq 401 ]; then
        echo -e "${GREEN}Status: $http_code (Unauthorized)${NC}"
    else
        echo -e "${RED}Status: $http_code${NC}"
    fi
done

echo -e "\n${BLUE}📊 RESUMO DOS ENDPOINTS${NC}"
echo "=========================="
echo -e "${GREEN}✅ Endpoints Públicos:${NC}"
echo "  GET  /health"
echo "  GET  /firebase-test"
echo "  GET  /skateparks"
echo "  GET  /skateparks?city=<cidade>"
echo "  GET  /skateparks/:id"
echo "  GET  /skateparks/city/:city"
echo ""
echo -e "${YELLOW}🔒 Endpoints Protegidos (requerem JWT):${NC}"
echo "  POST /auth/login"
echo "  GET  /auth/profile"
echo "  GET  /auth/validate"
echo "  GET  /users"
echo "  GET  /users/me"
echo "  GET  /users/:uid"
echo "  POST /users"
echo "  PUT  /users/:uid"
echo "  DELETE /users/:uid"
echo "  GET  /users/:uid/skateparks"
echo "  POST /users/:uid/skateparks/:parkId"
echo "  GET  /monitoring/stats"
echo "  GET  /monitoring/health-detailed"

echo -e "\n${GREEN}🎉 Teste completo finalizado!${NC}"
echo -e "${BLUE}📚 Documentação: http://localhost:3001/api/docs${NC}"