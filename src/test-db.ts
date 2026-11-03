import { prisma } from './config/database';
import { logger } from './utils/logger';

async function testConnection() {
  try {
    await prisma.$connect();
    logger.info('✅ Connexion à la base de données réussie');
    
    // Tester une requête simple
    const userCount = await prisma.user.count();
    logger.info(`📊 Nombre d'utilisateurs: ${userCount}`);
    
    await prisma.$disconnect();
    logger.info('✅ Déconnexion réussie');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
}

testConnection();