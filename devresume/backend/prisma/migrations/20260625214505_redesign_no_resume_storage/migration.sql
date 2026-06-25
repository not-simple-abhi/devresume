/*
  Warnings:

  - You are about to drop the column `resume_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `resumes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `overall_score` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_name` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "resumes" DROP CONSTRAINT "resumes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_resume_id_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "resume_id",
ADD COLUMN     "overall_score" INTEGER NOT NULL,
ADD COLUMN     "resume_name" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "resumes";

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
