import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/errorHandler';

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [totalAgencies, totalArticles, totalJobOffers, totalContacts, recentContacts, recentAgencies] = await Promise.all([
    prisma.agency.count(),
    prisma.article.count(),
    prisma.jobOffer.count({ where: { active: true } }),
    prisma.contactRequest.count(),
    prisma.contactRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, firstName: true, lastName: true, subject: true, status: true, createdAt: true } }),
    prisma.agency.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, city: true, country: true, type: true, createdAt: true } })
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: { agencies: totalAgencies, articles: totalArticles, jobOffers: totalJobOffers, contacts: totalContacts },
      recentActivities: { contacts: recentContacts, agencies: recentAgencies }
    }
  });
});