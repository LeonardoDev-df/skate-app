import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression'; // ✅ CORRIGIDO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Security - Ajustado para produção
  if (process.env.NODE_ENV === 'env') {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));
  }
  
  app.use(compression()); // ✅ Agora funciona

  // ✅ CORS Otimizado para Desenvolvimento e Produção
  const isDevelopment = process.env.NODE_ENV !== 'env';
  
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS,
    // Desenvolvimento
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:5173', // Vite padrão
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:5173',
  ].filter(Boolean);

  // Separar múltiplas origens se estiverem em uma string
  const validOrigins = allowedOrigins.flatMap(origin => 
    typeof origin === 'string' && origin.includes(',') 
      ? origin.split(',').map(o => o.trim())
      : [origin]
  ).filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // ✅ Permitir requisições sem origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // ✅ Verificar se a origin está permitida
      if (validOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // ✅ Em desenvolvimento, ser mais permissivo
      if (isDevelopment) {
        console.log(`🌐 CORS: Permitindo origin de desenvolvimento: ${origin}`);
        return callback(null, true);
      }
      
      // ✅ Em produção, ser mais restritivo
      console.warn(`🚫 CORS: Origin não permitida: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} não permitida`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'X-File-Name'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400, // Cache preflight por 24h
  });

  // ✅ Global pipes com melhor configuração
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'env',
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));
        return new Error(`Validation failed: ${JSON.stringify(result)}`);
      },
    }),
  );

  // ✅ Swagger apenas em desenvolvimento ou staging
  if (isDevelopment || process.env.ENABLE_DOCS === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Skate App API')
      .setDescription('API para o aplicativo de skate com Game of Skate')
      .setVersion('1.0')
      .addTag('skateparks', 'Operações relacionadas aos skateparks')
      .addTag('auth', 'Autenticação e autorização')
      .addTag('users', 'Gerenciamento de usuários')
      .addTag('game', 'Sistema de Game of Skate')
      .addTag('ranking', 'Sistema de ranking e pontuação')
      .addTag('tutorials', 'Tutoriais e manobras')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      })
      .addServer(
        isDevelopment 
          ? 'http://localhost:3001' 
          : process.env.BACKEND_URL || 'https://app-skate-lion.vercel.app',
        isDevelopment ? 'Servidor de Desenvolvimento' : 'Servidor de Produção'
      )
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showRequestHeaders: true,
        docExpansion: 'none',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
      },
      customSiteTitle: 'Skate App API Documentation',
      customfavIcon: '/favicon.ico',
    });

    console.log(`📚 Documentação Swagger: http://localhost:${process.env.PORT || 3001}/api/docs`);
  }

  // ✅ Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: process.uptime(),
    });
  });

  // ✅ Global prefix para todas as rotas exceto health
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  const port = process.env.PORT || 3001;
  
  // ✅ Configuração específica para Vercel
  if (process.env.VERCEL) {
    await app.listen(port, '0.0.0.0');
  } else {
    await app.listen(port);
  }
  
  // ✅ Logs informativos
  const baseUrl = process.env.VERCEL 
    ? `https://${process.env.VERCEL_URL}` 
    : `http://localhost:${port}`;
    
  console.log(`🚀 Backend rodando em: ${baseUrl}`);
  console.log(`💚 Health check: ${baseUrl}/health`);
  
  if (isDevelopment || process.env.ENABLE_DOCS === 'true') {
    console.log(`📚 Documentação: ${baseUrl}/api/docs`);
  }
  
  console.log(`🌐 CORS configurado para: ${validOrigins.join(', ')}`);
  console.log(`�� Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏗️  Plataforma: ${process.env.VERCEL ? 'Vercel' : 'Local'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao inicializar o backend:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});