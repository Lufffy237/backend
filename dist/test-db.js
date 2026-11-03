"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
async function testConnection() {
    try {
        await database_1.prisma.$connect();
        logger_1.logger.info('✅ Connexion à la base de données réussie');
        // Tester une requête simple
        const userCount = await database_1.prisma.user.count();
        logger_1.logger.info(`📊 Nombre d'utilisateurs: ${userCount}`);
        await database_1.prisma.$disconnect();
        logger_1.logger.info('✅ Déconnexion réussie');
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('❌ Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
}
testConnection();
//# sourceMappingURL=test-db.js.map