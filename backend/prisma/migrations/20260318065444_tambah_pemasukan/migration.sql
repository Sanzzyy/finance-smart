-- CreateTable
CREATE TABLE "Pemasukan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sumber" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Pemasukan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
