#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE purchase_db;
    CREATE DATABASE course_db;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE purchase_db TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE course_db TO $POSTGRES_USER;
EOSQL

echo "Databases user_db, purchase_db and course_db created successfully!"
