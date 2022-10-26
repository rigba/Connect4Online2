-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_joinedID_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "joinedID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_joinedID_fkey" FOREIGN KEY ("joinedID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
