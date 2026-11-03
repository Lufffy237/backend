"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getDashboardStats = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const [totalAgencies, totalArticles, totalJobOffers, totalContacts, recentContacts, recentAgencies] = await Promise.all([
        database_1.prisma.agency.count(),
        database_1.prisma.article.count(),
        database_1.prisma.jobOffer.count({ where: { active: true } }),
        database_1.prisma.contactRequest.count(),
        database_1.prisma.contactRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, firstName: true, lastName: true, subject: true, status: true, createdAt: true } }),
        database_1.prisma.agency.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, city: true, country: true, type: true, createdAt: true } })
    ]);
    res.status(200).json({
        success: true,
        data: {
            stats: { agencies: totalAgencies, articles: totalArticles, jobOffers: totalJobOffers, contacts: totalContacts },
            recentActivities: { contacts: recentContacts, agencies: recentAgencies }
        }
    });
});
//# sourceMappingURL=dashboard.controller.js.map