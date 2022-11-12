/*
  Warnings:

  - A unique constraint covering the columns `[gameUUID]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "rematch" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameUUID_key" ON "Game"("gameUUID");
