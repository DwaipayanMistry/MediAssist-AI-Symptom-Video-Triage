/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT 'dv-1.0.0',
ALTER COLUMN "role" SET DEFAULT 'PATIENT';
