/*
  Warnings:

  - The values [FULL_TIME,PART_TIME,INTERNSHIP,CONTRACT] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.
  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `alt` on the `gallery_images` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `job_offers` table. All the data in the column will be lost.
  - Added the required column `title` to the `gallery_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `gallery_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `gallery_images` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GalleryItemType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('EVENEMENTS', 'EQUIPES', 'PRESTATIONS', 'AGENCES', 'DISTINCTIONS');

-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('EMPLOI', 'STAGE');
ALTER TABLE "job_offers" ALTER COLUMN "type" TYPE "JobType_new" USING ("type"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "JobType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'EDITOR';
COMMIT;

-- AlterTable
ALTER TABLE "agencies" ADD COLUMN     "province" TEXT;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "readTime" TEXT,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "contact_requests" ADD COLUMN     "offerId" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "gallery_images" DROP COLUMN "alt",
ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "GalleryItemType" NOT NULL,
ADD COLUMN     "videoId" TEXT,
ADD COLUMN     "videoPlatform" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "category",
ADD COLUMN     "category" "GalleryCategory" NOT NULL;

-- AlterTable
ALTER TABLE "job_offers" DROP COLUMN "requirements",
ADD COLUMN     "contract" TEXT,
ADD COLUMN     "howToApply" TEXT,
ADD COLUMN     "missions" TEXT[],
ADD COLUMN     "profile" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "role" SET DEFAULT 'EDITOR';

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
