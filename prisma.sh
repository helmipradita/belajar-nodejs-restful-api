# Description: Prisma setup script for creating a new project
npx prisma init 

# Ganti provider ke MySQL
# Ganti .env url ke mysql://user:password@host:port/db 

# Buat model 1. User
# Buka schema.prisma dan tambahkan model User serta field 
# Membuat migration baru dari model yang telah dibuat
npx prisma migrate dev --create-only
# Tambahkan nama migration create_table_user
# Cek terlebih dahulu migration yang telah dibuat pada folder prisma/migrations
# Jalankan migration
npx prisma migrate dev

# Buat model 2. Contact
# Buka schema.prisma dan tambahkan model Contact serta field serta relasi ke User
# Membuat migration baru dari model yang telah dibuat
npx prisma migrate dev --create-only
# Tambahkan nama migration create_table_contact
# Cek terlebih dahulu migration yang telah dibuat pada folder prisma/migrations
# Jalankan migration
npx prisma migrate dev

# Buat model 3. Address
# Buka schema.prisma dan tambahkan model Address serta field serta relasi ke Contact
# Membuat migration baru dari model yang telah dibuat
npx prisma migrate dev --create-only
# Tambahkan nama migration create_table_address
# Cek terlebih dahulu migration yang telah dibuat pada folder prisma/migrations
# Jalankan migration
npx prisma migrate dev