-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "gameBoard" INTEGER[],
    "whoseMove" INTEGER NOT NULL,
    "winner" INTEGER,
    "gameUUID" VARCHAR NOT NULL,
    "usersId" INTEGER,

    CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fa1dd6f1e17797f1028184237fe" ON "game"("gameUUID");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_78a916df40e02a9deb1c4b75edb" ON "user"("username");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "FK_bb6073cacff8e8c8eeb851ec536" FOREIGN KEY ("usersId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
