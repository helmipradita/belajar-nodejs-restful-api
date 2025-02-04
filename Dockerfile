# Gunakan image resmi MySQL
FROM mysql:8.0

# Salin skrip inisialisasi ke MySQL /docker-entrypoint-initdb.d
COPY ./init-db.sql /docker-entrypoint-initdb.d/

# Set environment variable
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_PORT

ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}

# Expose port dari variabel ENV
EXPOSE ${MYSQL_PORT}
