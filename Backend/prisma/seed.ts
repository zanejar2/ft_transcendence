import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const hmeda = await prisma.user.upsert({
    where: { email: 'hmeda@prisma.io' },
    update: {},
    create: {
      email: 'hmeda@prisma.io',
      username: 'hmeda',
      login: 'lmeda',
      picture: 'tswira',
    },
  });

  const azoouz = await prisma.user.upsert({
    where: { email: 'azoouz@prisma.io' },
    update: {},
    create: {
      email: 'azoouz@prisma.io',
      username: 'azoouz',
      login: 'fegooss',
      picture: 'tswira',
    },
  });
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
