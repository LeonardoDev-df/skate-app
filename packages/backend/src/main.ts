import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  // app.use(helmet()); // Comentado temporariamente para desenvolvimento
  app.use(compression());

  // ✅ CORS Ajustado para múltiplas origens
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002', // Frontend Vite
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3002',
  ];

  // Filtrar origens undefined/null
  const validOrigins = allowedOrigins.filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (ex: Postman, curl)
      if (!origin) return callback(null, true);
      
      // Verificar se a origin está na lista permitida
      if (validOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Em desenvolvimento, ser mais permissivo
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      
      callback(new Error('Não permitido pelo CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Para suporte a browsers legados
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Skate App API')
    .setDescription('API para o aplicativo de skate com Game of Skate')
    .setVersion('1.0')
    .addTag('skateparks', 'Operações relacionadas aos skateparks')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('game', 'Sistema de Game of Skate')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Servidor de Desenvolvimento')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação: http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS configurado para: ${validOrigins.join(', ')}`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao inicializar o backend:', error);
  process.exit(1);
});