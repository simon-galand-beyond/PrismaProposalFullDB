-- CreateTable
CREATE TABLE "Voile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ParameterDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "publicName" TEXT NOT NULL,
    "min" REAL NOT NULL,
    "max" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "accessLevel" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "pilot" TEXT NOT NULL,
    "voileId" INTEGER NOT NULL,
    CONSTRAINT "Parameter_name_fkey" FOREIGN KEY ("name") REFERENCES "ParameterDetails" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parameter_voileId_fkey" FOREIGN KEY ("voileId") REFERENCES "Voile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ParameterDetails_name_key" ON "ParameterDetails"("name");
