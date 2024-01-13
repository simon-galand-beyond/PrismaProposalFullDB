-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ParameterDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pilot" TEXT NOT NULL,
    "publicName" TEXT NOT NULL,
    "min" REAL NOT NULL,
    "max" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "accessLevel" INTEGER NOT NULL
);
INSERT INTO "new_ParameterDetails" ("accessLevel", "id", "max", "min", "name", "pilot", "publicName", "unit") SELECT "accessLevel", "id", "max", "min", "name", "pilot", "publicName", "unit" FROM "ParameterDetails";
DROP TABLE "ParameterDetails";
ALTER TABLE "new_ParameterDetails" RENAME TO "ParameterDetails";
CREATE UNIQUE INDEX "ParameterDetails_name_key" ON "ParameterDetails"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
