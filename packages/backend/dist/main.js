"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const compression = require("compression");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(compression());
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3002',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3002',
    ];
    const validOrigins = allowedOrigins.filter(Boolean);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (validOrigins.includes(origin)) {
                return callback(null, true);
            }
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
        optionsSuccessStatus: 200,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
//# sourceMappingURL=main.js.map