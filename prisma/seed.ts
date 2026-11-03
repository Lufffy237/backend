import { PrismaClient, Role, AgencyType, JobType, GalleryItemType, GalleryCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // 1. Créer le Super Admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@elegance-pressing.com' },
    update: {},
    create: {
      name: 'Super Administrateur',
      email: 'admin@elegance-pressing.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN' as Role,
      isActive: true,
    },
  });

  // 2. Créer les catégories par défaut
  const categories = [
    { name: 'Recrutement & Stages', slug: 'recrutement' },
    { name: 'Conseils d\'Experts', slug: 'conseils' },
    { name: 'Actualités', slug: 'actualites' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Catégories créées');

  // Récupérer la catégorie "actualites" pour l'exemple d'article
  const actualitesCategory = await prisma.category.findUnique({ where: { slug: 'actualites' } });

  // 3. Créer un article de blog exemple
  await prisma.article.upsert({
    where: { slug: 'premier-article' },
    update: {},
    create: {
      title: 'Bienvenue sur le nouveau site d\'Élégance Pressing',
      slug: 'premier-article',
      content: 'Ceci est le contenu de notre premier article de démonstration.',
      excerpt: 'Découvrez les nouveautés de notre plateforme et nos services.',
      coverImage: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
      readTime: '3 min',
      tags: ['Lancement', 'Entreprise'],
      published: true,
      categoryId: actualitesCategory?.id || null,
      authorId: adminUser.id,
    },
  });
  console.log('✅ Article de blog créé');

  // 4. Créer quelques agences
  await prisma.agency.createMany({
    data: [
      {
        name: 'Agence de Bonanjo',
        type: 'AGENCY' as AgencyType,
        country: 'Cameroun',
        city: 'Douala',
        province: 'Littoral',
        address: 'Face Beac',
        phone: '699 170 576',
        hours: 'Lun-Sam: 7h30-18h',
        latitude: 4.0511,
        longitude: 9.7679,
        published: true,
      },
      {
        name: 'Agence du Centre',
        type: 'AGENCY' as AgencyType,
        country: 'Gabon',
        city: 'Libreville',
        province: 'Estuaire',
        address: 'Boulevard Triomphal',
        phone: '+241 77 12 34 56',
        hours: 'Lun-Sam: 7h30-18h',
        latitude: -0.4162,
        longitude: 9.4673,
        published: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Agences créées');

  // 5. Créer une offre d'emploi exemple (AVEC LE SLUG)
  await prisma.jobOffer.upsert({
    where: { slug: 'superviseur-de-reseau-relation-client' },
    update: {},
    create: {
      title: 'Superviseur de Réseau & Relation Client',
      slug: 'superviseur-de-reseau-relation-client',
      type: 'EMPLOI' as JobType,
      location: 'Douala, Cameroun',
      contract: 'CDI',
      description: 'Nous recherchons un superviseur expérimenté pour gérer notre réseau d\'agences et assurer l\'excellence de notre relation client.',
      missions: [
        'Contrôle Qualité des prestations',
        'Management et formation des équipes',
        'Suivi de la performance commerciale'
      ],
      profile: 'Bac+5 en Management, 5 ans d\'expérience minimum dans un poste similaire.',
      howToApply: 'Envoyez votre CV à carriere@elegance-pressing.com',
      active: true,
      views: 0,
    },
  });
  console.log('✅ Offre d\'emploi créée');

  // 6. Créer une image de galerie exemple
  await prisma.galleryImage.create({
    data: {
      type: 'IMAGE' as GalleryItemType,
      category: 'EVENEMENTS' as GalleryCategory,
      title: 'Spectacle de feu - Événement corporate',
      url: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=800',
      likes: 245,
      downloads: 32,
      views: 1205,
      location: 'Douala, Cameroun',
    },
  });
  console.log('✅ Élément de galerie créé');

  // 7. Créer des partenaires exemples
  await prisma.partner.createMany({
    data: [
      {
        name: 'TotalEnergies',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop',
        website: 'https://totalenergies.cm',
        order: 1,
      },
      {
        name: 'Orange Cameroun',
        logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=100&fit=crop',
        website: 'https://www.orange.cm',
        order: 2,
      },
      {
        name: 'Société Générale',
        logo: 'https://images.unsplash.com/photo-1565514020176-db7936a282f1?w=200&h=100&fit=crop',
        website: 'https://societegenerale.cm',
        order: 3,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Partenaires créés');

  // 8. Créer des distinctions exemples
  await prisma.award.createMany({
    data: [
      {
        title: 'Certification ISO 9001:2015',
        year: 2023,
        issuer: 'Bureau Veritas',
        image: 'https://images.unsplash.com/photo-1589330694653-4d5c953b2769?w=600&h=400&fit=crop',
        order: 1,
      },
      {
        title: 'Meilleur Service Client de l\'Année',
        year: 2024,
        issuer: 'Chambre de Commerce du Cameroun',
        image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=600&h=400&fit=crop',
        order: 2,
      },
      {
        title: 'Label Entreprise Verte & Écologique',
        year: 2022,
        issuer: 'Ministère de l\'Environnement',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
        order: 3,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Distinctions créées');

  console.log('🎉 Seed terminé avec succès !');
  console.log('👤 Admin: admin@elegance-pressing.com / Mot de passe: Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });