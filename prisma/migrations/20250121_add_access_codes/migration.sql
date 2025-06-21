-- CreateTable
CREATE TABLE "access_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "max_uses" INTEGER DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "access_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_code_uses" (
    "id" TEXT NOT NULL,
    "access_code_id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT,
    "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "access_code_uses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_codes_code_key" ON "access_codes"("code");

-- CreateIndex
CREATE INDEX "access_codes_expires_at_idx" ON "access_codes"("expires_at");

-- CreateIndex
CREATE INDEX "access_code_uses_access_code_id_idx" ON "access_code_uses"("access_code_id");

-- CreateIndex
CREATE INDEX "access_code_uses_user_id_idx" ON "access_code_uses"("user_id");

-- AddForeignKey
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code_uses" ADD CONSTRAINT "access_code_uses_access_code_id_fkey" FOREIGN KEY ("access_code_id") REFERENCES "access_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code_uses" ADD CONSTRAINT "access_code_uses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;