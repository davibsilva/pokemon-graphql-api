import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const electric = await prisma.type.upsert({
    where: { name: 'ELECTRIC' },
    update: {},
    create: { name: 'ELECTRIC' },
  });

  const fire = await prisma.type.upsert({
    where: { name: 'FIRE' },
    update: {},
    create: { name: 'FIRE' },
  });

  await prisma.pokemon.upsert({
    where: { name: 'Pikachu' },
    update: {},
    create: {
      name: 'Pikachu',
      types: {
        create: [
          { type: { connect: { id: electric.id } } },
          { type: { connect: { id: fire.id } } },
        ],
      },
    },
  });
}

main()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
