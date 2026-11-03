-- 1. Ajouter la colonne temporairement sans contrainte
ALTER TABLE "public"."job_offers" ADD COLUMN "slug" TEXT;

-- 2. Générer le slug en ajoutant les 8 premiers caractères de l'ID 
-- pour garantir l'unicité absolue même si les titres sont identiques
UPDATE "public"."job_offers" 
SET "slug" = LOWER(REGEXP_REPLACE("title", '[^a-zA-Z0-9]+', '-', 'g')) || '-' || LEFT(id::text, 8);

-- 3. Rendre la colonne obligatoire et ajouter la contrainte d'unicité
ALTER TABLE "public"."job_offers" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "job_offers_slug_key" ON "public"."job_offers"("slug");