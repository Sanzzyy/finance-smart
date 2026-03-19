-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pemasukan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sumber" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "kategori" TEXT NOT NULL DEFAULT 'Lainnya',
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Pemasukan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pemasukan" ("id", "jumlah", "sumber", "tanggal", "userId") SELECT "id", "jumlah", "sumber", "tanggal", "userId" FROM "Pemasukan";
DROP TABLE "Pemasukan";
ALTER TABLE "new_Pemasukan" RENAME TO "Pemasukan";
CREATE TABLE "new_Pengeluaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toko" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "kategori" TEXT NOT NULL DEFAULT 'Lainnya',
    "items" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Pengeluaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pengeluaran" ("id", "items", "tanggal", "toko", "total", "userId") SELECT "id", "items", "tanggal", "toko", "total", "userId" FROM "Pengeluaran";
DROP TABLE "Pengeluaran";
ALTER TABLE "new_Pengeluaran" RENAME TO "Pengeluaran";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
