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
  requiredOpenBadgeName?: string;
  requiredOpenBadgeLevel?: number;
};

type SeedOpenBadgeLevel = {
  level: number;
  title: string;
  description?: string;
};

type SeedOpenBadge = {
  type: string;
  category: string;
  name: string;
  description: string;
  levels: SeedOpenBadgeLevel[];
  trainerThresholdLevel?: number;
};

const seedMachinesData: SeedMachine[] = [
  {
    category: 'Impression 3D',
    name: 'Bambu Lab X1C n°1',
    description: 'Imprimante 3D Bambu Lab pour pièces techniques.',
    imageUrl: null,
    requiredOpenBadgeName: 'Impression 3D Bambu Lab',
    requiredOpenBadgeLevel: 1
  },
  {
    category: 'Impression 3D',
    name: 'Bambu Lab X1C n°2',
    description: 'Imprimante 3D Bambu Lab pour prototypage rapide.',
    imageUrl: null,
    requiredOpenBadgeName: 'Impression 3D Bambu Lab',
    requiredOpenBadgeLevel: 1
  },
  {
    category: 'Découpe laser',
    name: 'Laserbox',
    description: 'Machine de découpe laser Laserbox.',
    imageUrl: null,
    requiredOpenBadgeName: 'découpe laser Laserbox',
    requiredOpenBadgeLevel: 1
  }
];

const seedOpenBadgesData: SeedOpenBadge[] = [
  {
    type: 'Machine',
    category: 'machine',
    name: 'Impression 3D Bambu Lab',
    description: "Certification permettant d'utiliser les machines d'impression 3D Bambu lab du fab lab",
    levels: [
      {
        level: 1,
        title: 'Utilisateur autonome',
        description: `Personne autonome qui sait utiliser la machine dans des conditions standards. Elle représente la majorité des usagers du FabLab.

- Connaître le fonctionnement théorique et la composition de la machine

- Connaître les matériaux standards : PLA, ABS, PVA, PP, PET, ASA, etc.

- Connaître les dangers et les risques corporels liés à l'utilisation de la machine :
incendie, émission de composés toxiques, brulures, etc.

- Connaître les dangers et les risques techniques liés à l'utilisation de la machine :
utilisation dans un environnement poussiéreux, éjection plateau, collision buse - obstacle, etc.

- Savoir utiliser le logiciel de fabrication : paramétrer, générer le fichier, etc.

- Connaître les types de fichiers utilisés : Gcode, STL, etc.

- Connaître la méthode de transfert du GCode en fonction de la machine : réseau, USB, etc.

- Savoir configurer le logiciel avec les paramètres standards : ajouter une pièce, positionner une pièce, orienter une pièce, ajouter des supports, etc.

- Savoir réaliser les vérifications d'usage avant le lancement du travail : plateau apprêté, nature du matériau conforme, matériau chargé et en quantité suffisante, machine et buse propres, etc.

- Savoir préparer le travail : mise à niveau et nettoyage du plateau, changement de consommable, etc.

- Savoir surveiller le travail et intervenir : mettre en pause, reprise, arrêt urgence, déplacement manuel, etc.

- Savoir réagir et intervenir en cas de danger iminnent.

- Savoir manipuler et stocker le matériel : outils, produits de nettoyage, matériaux consommables, etc.

- Savoir contrôler la fabrication de manière qualitative (de visu), pendant et après la fabrication : décollement de la pièce, mauvaise impression, etc.`
      },
      {
        level: 2,
        title: 'Utilisateur avancé',
        description: `Personne qui maîtrise la machine de manière plus avancée, qui est familière de son utilisation. Elle est capable de procéder aux réglages avancés et d'en assurer la maintenance courante. Elle est capable d'accompagner le niveau 1.

- Savoir identifier et corriger les défauts  : warping, sur-extrusion, sous-extrusion, problème température, etc.

- Savoir configurer le logiciel avec les paramètres avancés pour optimiser la fabrication : température, orientation, remplissage, finesse, vitesse, etc.`
      },
      {
        level: 3,
        title: 'Utilisateur expert',
        description: `Personne experte avec une connaissance/expérience précise de la technologie et du process. Personne ressource pour des réglages très précis et des pièces de
haute technicité. Elle est capable d'assurer la maintenance avancée et d'accompagner les niveaux 1 et 2.

- Savoir assurer la maintenance avancée : nettoyage et graissage des axes, nettoyage et changement de la buse d'extrusion, etc`
      }
    ],
    trainerThresholdLevel: 2
  },
  {
    type: 'Machine',
    category: 'machine',
    name: 'découpe laser Laserbox',
    description: "Certification permettant d'utiliser la machine de découpe laser Laserbox du fab lab",
    levels: [
      {
        level: 1,
        title: 'Utilisateur autonome',
        description: `- Connaître le fonctionnement théorique et la composition de la machine.

- Connaître les matériaux standards : plexiglas, MDF, contreplaqué, etc.

- Connaître les matériaux non-compatibles et/ou interdits pour les risques qu'ils présentent : PVC, Vynil, PC, etc.

- Connaître les dangers et les risques corporels liés à l'utilisation de la machine :
incendie, émission de composés toxiques, brulures, rayonnement optique, etc.

- Connaître les dangers et les risques techniques liés à l'utilisation de la machine : collision mécanique, voilement d'un matériau, etc.

- Connaître les logiciels utilisés pour le pilotage de la machine : JobControl,
Inkscape, etc.

- Connaître les types de fichiers utilisés :vectoriel, matriciel, etc.

- Connaître la méthode de transfert du GCode en fonction de la machine : réseau, USB, etc.

- Savoir configurer le logiciel avec les paramètres standards : distinguer le marquage, la gravure et la découpe, paramétrer et ordonnancer les étapes de fabrication (épaisseur de trait, couleur de trait, puissance et vitesse d'avance du laser, déterminer le point de démarrage du travail (en haut à gauche, en bas à droite, etc.).

- Savoir configurer le logiciel avec les paramètres avancés pour optimiser la fabrication : vitesse, fréquence, algorithme de gravure, précision, etc.

- Savoir utiliser le logiciel de fabrication : paramétrer, générer le fichier, etc.

- Savoir réaliser les vérifications d'usage avant le lancement du travail : grille adaptée, nature du matériau conforme, machine et optiques propres, absence d'obstacle, ventilation, extraction, etc.

- Savoir préparer le travail : choisir la grille en fonction de la pièce, positionner le brut et le fixer sur la grille, régler la focale et le débit d'air, etc.

- Savoir surveiller le travail et intervenir : mettre en pause, reprise, arrêt urgence, déplacement manuel, etc.

- Savoir réagir et intervenir en cas de danger iminnent.

- Savoir manipuler et stocker le matériel : outils, produits de nettoyage, matériaux consommables, etc.

- Savoir contrôler la fabrication de manière qualitative (de visu), pendant et après la fabrication : départ de flamme, découpe non traversante, dédoublement de faisceau, déplacement du matériau, etc.

- Savoir identifier et corriger des défauts courant
(mauvais réglage, brûlure...)

- Savoir réaliser le post-traitement : nettoyage et ponçage de la pièce, etc.

- Savoir assurer l'entretien de base : nettoyage du poste de travail et de la machine, récupération des déchets, rechargement en matériel, etc.`
      },
      {
        level: 2,
        title: 'Utilisateur avancé',
        description: '- Savoir identifier et corriger des défauts courant (mauvais réglages, brûlures...)'
      },
      {
        level: 3,
        title: 'Utilisateur expert',
        description: `- Savoir assurer la maintenance avancée :
nettoyage et réglage du circuit optique
(miroirs et lentilles), entretenir le circuit d'air,
etc.

- Être disponible pour accueillir,
informer et partager ses savoirs et savoirfaire
avec des utilisateurs`
      }
    ],
    trainerThresholdLevel: 2
  },
  {
    type: 'Réparation',
    category: 'réparation',
    name: 'réparation JoyCon Nintendo',
    description: 'Certification permettant de réparer les manettes de jeux Nintendo JoyCon pour Nintendo Switch',
    levels: [
      {
        level: 1,
        title: 'Utilisateur autonome',
        description: `Ce niveau d'open badge valide que l'utilisateur a été formé à :
- connaitre les outils à utiliser
- préparer le plan de travail
- l'identification des trois pannes les plus courantes (joystick drift, rail de connexion, gachette)
- le démontage de la manette pour les trois types de pannes
- le changement des pièces détachées
- le remontage de la manette
- le testing de la manette une fois les pièces changées
- la gestion des pièces détachées neuves et déffectueuses
- la gestion de la manette et le contact avec son propriétaire`
      },
      {
        level: 2,
        title: 'Utilisateur expert',
        description:
          "Ce niveau d'open badge valide que l'utilisateur est capable de former une autre personne au premier niveau. Il sait détailler et expliquer tous les points du premier niveau de manière professionnelle."
      }
    ],
    trainerThresholdLevel: 2
  },
  {
    type: 'Organisation',
    category: 'gestion et organisation',
    name: 'organisation du Repair Café',
    description: 'Certification validant la gestion du repair café',
    levels: [
      {
        level: 1,
        title: 'Utilisateur expert',
        description: `L'utilisateur sait gérer le repair café :
- il connait les outils et vérifie leur état et le rangement
- il sait nettoyer l'espace
- il sait accueillir les visiteurs dans le lieu
- il connait et sait expliquer le fonctionnement de récupération des objets, le rangement, le suivi de réparation et la restittution des objets`
      }
    ],
    trainerThresholdLevel: 1
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

    const record =
      existing ??
      (await prisma.machine.create({
        data: {
          category: machine.category,
          name: machine.name,
          description: machine.description,
          imageUrl: machine.imageUrl,
          creatorId
        }
      }));

    if (!machine.requiredOpenBadgeName) {
      continue;
    }

    const requiredBadge = await prisma.openBadge.findFirst({
      where: { name: machine.requiredOpenBadgeName },
      include: { levels: true }
    });

    if (!requiredBadge) {
      throw new Error(`Required open badge not found: ${machine.requiredOpenBadgeName}`);
    }

    const requiredLevel = machine.requiredOpenBadgeLevel
      ? requiredBadge.levels.find((level) => level.level === machine.requiredOpenBadgeLevel)
      : undefined;

    const requirementExists = await prisma.machineOpenBadgeRequirement.findFirst({
      where: {
        machineId: record.id,
        requiredOpenBadgeId: requiredBadge.id,
        requiredOpenBadgeLevelId: requiredLevel?.id ?? null
      }
    });

    if (!requirementExists) {
      await prisma.machineOpenBadgeRequirement.create({
        data: {
          machineId: record.id,
          requiredOpenBadgeId: requiredBadge.id,
          requiredOpenBadgeLevelId: requiredLevel?.id
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
      const created = await prisma.openBadge.create({
        data: {
          type: badge.type,
          category: badge.category,
          name: badge.name,
          description: badge.description,
          creatorId,
          levels: {
            create: badge.levels.map((level) => ({
              level: level.level,
              title: level.title,
              description: level.description ?? null
            }))
          }
        }
      });

      if (badge.trainerThresholdLevel) {
        const thresholdLevel = await prisma.openBadgeLevel.findFirst({
          where: {
            openBadgeId: created.id,
            level: badge.trainerThresholdLevel
          }
        });

        if (thresholdLevel) {
          await prisma.openBadge.update({
            where: { id: created.id },
            data: {
              trainerThresholdLevelId: thresholdLevel.id
            }
          });
        }
      }
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

  const adminMachines = seedMachinesData.slice(0, 2);
  const pedagogicalMachines = seedMachinesData.slice(2);

  const adminBadges = seedOpenBadgesData.slice(0, 2);
  const pedagogicalBadges = seedOpenBadgesData.slice(2);

  await seedOpenBadges(admin.id, adminBadges);
  await seedOpenBadges(pedagogicalAdmin.id, pedagogicalBadges);

  await seedMachines(admin.id, adminMachines);
  await seedMachines(pedagogicalAdmin.id, pedagogicalMachines);
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
