#!/bin/bash
set -e

# shellcheck disable=SC2046
export $(grep -v '^#' .env | xargs)

HOST=$DB_HOST;
PORT=$DB_PORT;
USERNAME=$DB_USERNAME;
PASSWORD=$DB_PASSWORD;
NAME=$DB_NAME;
PS_DOCKER=$PS_DOCKER_NAME


echo "CREATE DATABASE [$NAME] ON [$HOST]:[$PORT] ";

# wait for pg to start
echo "sleep wait for pg-server [$HOST] to start";
sleep 1;

# create the db
DOES_ROLE_EXIST=`docker exec -i $PS_DOCKER psql -U postgres -t -c "SELECT 1 FROM pg_roles WHERE rolname='$USERNAME'"`;
if [ -z "$DOES_ROLE_EXIST" ]; then
  echo "CREATE ROLE $USERNAME WITH LOGIN PASSWORD '$PASSWORD';" | docker exec -i $PS_DOCKER psql -U postgres;
  echo "ALTER ROLE $USERNAME WITH SUPERUSER;" | docker exec -i $PS_DOCKER psql -U postgres;
fi

DOES_DB_EXITS=`docker exec -i $PS_DOCKER psql -U postgres -t -c "SELECT 1 FROM pg_catalog.pg_database WHERE datname='$NAME'"`;
if [ -z "$DOES_DB_EXITS" ]; then
  echo "CREATE DATABASE $NAME ENCODING 'UTF-8';" | docker exec -i $PS_DOCKER psql -U postgres
fi