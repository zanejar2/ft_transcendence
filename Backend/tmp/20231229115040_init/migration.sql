-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "requestGameToken" TEXT,
    "inGame" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "WinnerId" TEXT NOT NULL,
    "LoserId" TEXT NOT NULL,
    "WinnerName" TEXT NOT NULL,
    "LoserName" TEXT NOT NULL,
    "WinnerScore" INTEGER NOT NULL,
    "LoserScore" INTEGER NOT NULL,
    "GameMode" TEXT NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
