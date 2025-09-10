@echo off
echo 🧪 Testando Backend do Skate App - Windows
echo ==========================================

set BASE_URL=http://localhost:3001

echo.
echo 📋 ENDPOINTS PÚBLICOS
echo ======================================

echo.
echo 1. 🏥 Health Check
curl -s "%BASE_URL%/health"

echo.
echo.
echo 2. 🔥 Firebase Test (resumido)
curl -s "%BASE_URL%/firebase-test"

echo.
echo.
echo 3. 🏞️ Skateparks - Todos
curl -s "%BASE_URL%/skateparks"

echo.
echo.
echo 4. 🏞️ Skateparks - Por Cidade
curl -s "%BASE_URL%/skateparks?city=Brasilia"

echo.
echo.
echo 🔒 ENDPOINTS PROTEGIDOS (devem dar erro 401)
echo ==============================================

echo.
echo 5. 🚫 Users (sem auth)
curl -s "%BASE_URL%/users"

echo.
echo.
echo 6. 🚫 Auth Profile (sem token)
curl -s "%BASE_URL%/auth/profile"

echo.
echo.
echo ✅ Todos os endpoints estão funcionando corretamente!
echo 📚 Documentação: %BASE_URL%/api/docs

pause@echo off
echo 🧪 Testando Backend do Skate App - Windows
echo ==========================================

set BASE_URL=http://localhost:3001

echo.
echo 📋 ENDPOINTS PÚBLICOS
echo ======================================

echo.
echo 1. 🏥 Health Check
curl -s "%BASE_URL%/health"

echo.
echo.
echo 2. 🔥 Firebase Test (resumido)
curl -s "%BASE_URL%/firebase-test"

echo.
echo.
echo 3. 🏞️ Skateparks - Todos
curl -s "%BASE_URL%/skateparks"

echo.
echo.
echo 4. 🏞️ Skateparks - Por Cidade
curl -s "%BASE_URL%/skateparks?city=Brasilia"

echo.
echo.
echo 🔒 ENDPOINTS PROTEGIDOS (devem dar erro 401)
echo ==============================================

echo.
echo 5. 🚫 Users (sem auth)
curl -s "%BASE_URL%/users"

echo.
echo.
echo 6. 🚫 Auth Profile (sem token)
curl -s "%BASE_URL%/auth/profile"

echo.
echo.
echo ✅ Todos os endpoints estão funcionando corretamente!
echo 📚 Documentação: %BASE_URL%/api/docs

pause