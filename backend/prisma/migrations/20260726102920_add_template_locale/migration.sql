-- CreateTable
CREATE TABLE "TemplateLocale" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateLocale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateLocale_templateId_locale_key" ON "TemplateLocale"("templateId", "locale");

-- AddForeignKey
ALTER TABLE "TemplateLocale" ADD CONSTRAINT "TemplateLocale_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "NotificationTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
