-- CreateTable
CREATE TABLE "keywords" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_domains" (
    "keyword_id" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "keyword_domains_pkey" PRIMARY KEY ("keyword_id","domain")
);

-- CreateTable
CREATE TABLE "keyword_aliases" (
    "id" SERIAL NOT NULL,
    "keyword_id" INTEGER NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "keyword_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keywords_keyword_key" ON "keywords"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "keyword_aliases_alias_key" ON "keyword_aliases"("alias");

-- AddForeignKey
ALTER TABLE "keyword_domains" ADD CONSTRAINT "keyword_domains_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyword_aliases" ADD CONSTRAINT "keyword_aliases_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;
