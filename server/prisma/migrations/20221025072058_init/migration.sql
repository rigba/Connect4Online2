-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "gameBoard" INTEGER[],
    "whoseMove" INTEGER NOT NULL,
    "winner" INTEGER,
    "gameUUID" VARCHAR NOT NULL,
    "createdId" INTEGER NOT NULL,
    "joinedID" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_joinedID_fkey" FOREIGN KEY ("joinedID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
