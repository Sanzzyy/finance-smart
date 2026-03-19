-- CreateTable
CREATE TABLE "Pengeluaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toko" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "items" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Pengeluaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
