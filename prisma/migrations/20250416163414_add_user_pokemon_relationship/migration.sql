-- AlterTable
ALTER TABLE "pokemons" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
