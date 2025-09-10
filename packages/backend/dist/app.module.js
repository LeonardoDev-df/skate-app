"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const firebase_module_1 = require("./firebase/firebase.module");
const monitoring_controller_1 = require("./monitoring/monitoring.controller");
const skatepark_controller_1 = require("./skatepark/skatepark.controller");
const skatepark_service_1 = require("./skatepark/skatepark.service");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const rate_limit_guard_1 = require("./common/guards/rate-limit.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
        ],
        controllers: [
            app_controller_1.AppController,
            monitoring_controller_1.MonitoringController,
            skatepark_controller_1.SkateparkController,
        ],
        providers: [
            app_service_1.AppService,
            skatepark_service_1.SkateparkService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: rate_limit_guard_1.RateLimitGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map