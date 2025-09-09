#!/bin/bash

set -e

CONTAINER_PROJECT_NAME="samfundet4"

SM4_CONTAINER_SERVICE="sm4_dev_database"
BILLIG_CONTAINER_SERVICE="billig_dev_database"

SM4_DEV_VOLUME_NAME=${SM4_CONTAINER_SERVICE}
BILLIG_DEV_VOLUME_NAME=${BILLIG_CONTAINER_SERVICE}

echo "🗄️ DATABASE VOLUME DESTRUCTION WARNING 🗄️"
echo "This will destroy ONLY the database volumes:"
echo "  - ${SM4_DEV_VOLUME_NAME} volume"
echo "  - ${BILLIG_DEV_VOLUME_NAME} volume"
echo ""
echo "This will NOT affect:"
echo "  - Running containers"
echo "  - Built images"
echo "  - Networks"
echo "  - Other volumes"
echo ""
echo "⚠️  All database data will be permanently lost!"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo

if [[ ! $REPLY == "yes" ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo "🚀 Starting database volume destruction..."

# Stop and remove database containers first (but leave others running)
echo "🛑 Stopping and removing database containers..."
docker compose stop ${SM4_CONTAINER_SERVICE} ${BILLIG_CONTAINER_SERVICE} || echo "⚠️  Some database containers were not running"
docker compose rm -f ${SM4_CONTAINER_SERVICE} ${BILLIG_CONTAINER_SERVICE} || echo "⚠️  Could not remove database containers"

# Remove only the database volumes
echo "🗑️  Removing database volumes..."
VOLUMES_REMOVED=0

if docker volume rm ${CONTAINER_PROJECT_NAME}_${SM4_DEV_VOLUME_NAME} 2>/dev/null; then
    echo "✅ ${CONTAINER_PROJECT_NAME}_${SM4_DEV_VOLUME_NAME} volume removed"
    VOLUMES_REMOVED=$((VOLUMES_REMOVED + 1))
else
    echo "⚠️  ${CONTAINER_PROJECT_NAME}_${SM4_DEV_VOLUME_NAME} volume not found or couldn't be removed"
fi

if docker volume rm ${CONTAINER_PROJECT_NAME}_${BILLIG_DEV_VOLUME_NAME} 2>/dev/null; then
    echo "✅ ${CONTAINER_PROJECT_NAME}_${BILLIG_DEV_VOLUME_NAME} volume removed"
    VOLUMES_REMOVED=$((VOLUMES_REMOVED + 1))
else
    echo "⚠️  ${CONTAINER_PROJECT_NAME}_${BILLIG_DEV_VOLUME_NAME} volume not found or couldn't be removed"
fi

echo ""
if [ $VOLUMES_REMOVED -gt 0 ]; then
    echo "✅ Database volumes destroyed successfully! ($VOLUMES_REMOVED volumes removed)"
    echo "💡 Run 'docker compose up sm4_dev_database billig_dev_database' to recreate the databases."
    echo "💡 You'll need to run migrations after recreating the databases."
else
    echo "⚠️  No database volumes were removed"
fi