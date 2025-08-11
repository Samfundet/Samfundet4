#!/bin/bash

set -e

SM4_CONTAINER_SERVICE="sm4_dev_database"
BILLIG_CONTAINER_SERVICE="billig_dev_database"

echo "🚀 Starting database containers in the background..."
echo "This will start:"
echo "  - ${SM4_CONTAINER_SERVICE} container"
echo "  - ${BILLIG_CONTAINER_SERVICE} container"
echo ""

# Start the database containers
if docker compose up -d ${SM4_CONTAINER_SERVICE} ${BILLIG_CONTAINER_SERVICE}; then
    echo "✅ Database containers started successfully!"
    echo ""
    echo "💡 Don't forget to run migrations after the databases are ready."
    echo "💡 Use 'docker compose logs ${SM4_CONTAINER_SERVICE}' or 'docker compose logs ${BILLIG_CONTAINER_SERVICE}' to check startup logs."
else
    echo "❌ Failed to start database containers"
    exit 1
fi