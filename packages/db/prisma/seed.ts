import { PrismaClient, Profile, StudentProfile, ExternalProfile } from '@prisma/client';
import { hashSecret } from '@repo/crypto';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD ?? 'ChangeMe123!';

async function hashPassword(password: string) {
  const { salt, iterations, hashedSecret } = await hashSecret(password);
  return { salt, iterations, password: hashedSecret };
}

type SeedUser = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profile: Profile;
  studentProfile?: StudentProfile;
  externalProfile?: ExternalProfile;
  educationLevel?: string;
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
};

type SeedMachine = {
  category: string;
  name: string;
  description: string;
  imageUrl: string | null;
};

type SeedOpenBadge = {
  type: string;
  category: string;
  name: string;
  description: string;
};

const seedMachinesData: SeedMachine[] = [
  {
    category: 'Impression 3D',
    name: 'Bambu Lab X1 Carbon',
    description: "Imprimante 3D haute vitesse pour pièces techniques.",
    imageUrl: null
  },
  {
    category: 'Impression 3D',
    name: 'Bambu Lab A1 Mini',
    description: "Imprimante 3D compacte idéale pour l’initiation.",
    imageUrl: null
  },
  {
    category: 'Impression 3D',
    name: 'Prusa MK4',
    description: 'Imprimante 3D fiable pour prototypage rapide.',
    imageUrl: null
  },
  {
    category: 'Découpe laser',
    name: 'Laser cutter X1',
    description: 'Découpe et gravure laser pour bois et acrylique.',
    imageUrl: null
  },
  {
    category: 'Usinage',
    name: 'CNC Router',
    description: 'Usinage CNC pour bois et matériaux composites.',
    imageUrl: null
  },
  {
    category: 'Découpe',
    name: 'Vinyl Cutter',
    description: 'Découpe vinyle pour signalétique et stickers.',
    imageUrl: null
  },
  {
    category: 'Électronique',
    name: 'Soldering Station',
    description: 'Station de soudure pour électronique.',
    imageUrl: null
  }
];

const seedOpenBadgesData: SeedOpenBadge[] = [
  {
    type: 'Administration',
    category: 'Machine',
    name: 'Impression 3D',
    description: "Certification pour l'utilisation des imprimantes 3D."
  },
  {
    type: 'Administration',
    category: 'Machine',
    name: 'Découpe laser',
    description: "Certification pour l'utilisation des machines de découpe laser."
  },
  {
    type: 'Administration',
    category: 'Machine',
    name: 'CNC Router',
    description: "Certification pour l'utilisation des machines CNC."
  },
  {
    type: 'Formation',
    category: 'Sécurité',
    name: 'Sécurité atelier',
    description: 'Règles de sécurité et bonnes pratiques en atelier.'
  },
  {
    type: 'Formation',
    category: 'Machine',
    name: 'Vinyle',
    description: "Initiation à l'utilisation des machines de découpe vinyle."
  },
  {
    type: 'Formation',
    category: 'Électronique',
    name: 'Électronique',
    description: 'Bases de la soudure et composants électroniques.'
  },
  {
    type: 'Formation',
    category: 'Prototypage',
    name: 'Design 3D',
    description: 'Modélisation 3D et préparation des fichiers.'
  },
  {
    type: 'Formation',
    category: 'Fabrication',
    name: 'Assemblage',
    description: 'Techniques de montage et d’assemblage.'
  },
  {
    type: 'Formation',
    category: 'Matériaux',
    name: 'Matériaux',
    description: 'Comprendre les matériaux et leurs usages.'
  },
  {
    type: 'Formation',
    category: 'Projet',
    name: 'Gestion de projet',
    description: 'Planification et suivi de projet en fab lab.'
  }
];

async function seedUsers(defaultPassword: string) {
  const users: SeedUser[] = [
    {
      email: 'admin@ventil.local',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Global',
      profile: Profile.teacher,
      globalAdmin: true,
      pedagogicalAdmin: false
    },
    {
      email: 'pedago@ventil.local',
      username: 'pedago',
      firstName: 'Admin',
      lastName: 'Pédagogique',
      profile: Profile.teacher,
      globalAdmin: false,
      pedagogicalAdmin: true
    },
    {
      email: 'student@ventil.local',
      username: 'student',
      firstName: 'Claude',
      lastName: 'Dupont',
      profile: Profile.student,
      studentProfile: StudentProfile.member,
      educationLevel: 'BTS 1ère année'
    },
    {
      email: 'student.visitor@ventil.local',
      username: 'student.visitor',
      firstName: 'Nina',
      lastName: 'Leroy',
      profile: Profile.student,
      studentProfile: StudentProfile.visitor,
      educationLevel: 'Terminale'
    },
    {
      email: 'student.alumni@ventil.local',
      username: 'student.alumni',
      firstName: 'Alex',
      lastName: 'Moreau',
      profile: Profile.student,
      studentProfile: StudentProfile.alumni,
      educationLevel: 'BTS 2ème année'
    },
    {
      email: 'external@ventil.local',
      username: 'external',
      firstName: 'Martin',
      lastName: 'Dubois',
      profile: Profile.external,
      externalProfile: ExternalProfile.contributor
    },
    {
      email: 'external.visitor@ventil.local',
      username: 'external.visitor',
      firstName: 'Lina',
      lastName: 'Roux',
      profile: Profile.external,
      externalProfile: ExternalProfile.visitor
    }
  ];

  for (const user of users) {
    const security = await hashPassword(defaultPassword);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        ...user,
        ...security
      },
      create: {
        ...user,
        ...security
      }
    });
  }
}

async function seedMachines(creatorId: string, machines: SeedMachine[]) {
  for (const machine of machines) {
    const existing = await prisma.machine.findFirst({
      where: { name: machine.name }
    });

    if (!existing) {
      await prisma.machine.create({
        data: {
          ...machine,
          creatorId
        }
      });
    }
  }
}

async function seedOpenBadges(creatorId: string, openBadges: SeedOpenBadge[]) {
  for (const badge of openBadges) {
    const existing = await prisma.openBadge.findFirst({
      where: { name: badge.name }
    });

    if (!existing) {
      await prisma.openBadge.create({
        data: {
          ...badge,
          creatorId,
          levels: {
            create: [
              {
                level: 1,
                title: 'Niveau 1',
                description: 'Découverte et prise en main.'
              },
              {
                level: 2,
                title: 'Niveau 2',
                description: 'Utilisation autonome.'
              },
              {
                level: 3,
                title: 'Niveau 3',
                description: 'Expertise et accompagnement.'
              }
            ]
          }
        }
      });
    }
  }
}

async function main() {
  await seedUsers(DEFAULT_PASSWORD);

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@ventil.local' },
    select: { id: true }
  });

  if (!admin) {
    throw new Error('Seed admin user not found.');
  }

  const pedagogicalAdmin = await prisma.user.findUnique({
    where: { email: 'pedago@ventil.local' },
    select: { id: true }
  });

  if (!pedagogicalAdmin) {
    throw new Error('Seed pedagogical admin user not found.');
  }

  const adminMachines = seedMachinesData.slice(0, 4);
  const pedagogicalMachines = seedMachinesData.slice(4);

  await seedMachines(admin.id, adminMachines);
  await seedMachines(pedagogicalAdmin.id, pedagogicalMachines);

  const adminBadges = seedOpenBadgesData.slice(0, 5);
  const pedagogicalBadges = seedOpenBadgesData.slice(5);

  await seedOpenBadges(admin.id, adminBadges);
  await seedOpenBadges(pedagogicalAdmin.id, pedagogicalBadges);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
