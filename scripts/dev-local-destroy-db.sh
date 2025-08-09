#!/bin/bash

set -e

echo "🗄️ DATABASE VOLUME DESTRUCTION WARNING 🗄️"
echo "This will destroy ONLY the database volumes:"
echo "  - sm4_dev_database volume"
echo "  - billig_dev_database volume"
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
docker compose rm -f sm4_dev_database billig_dev_database || echo "⚠️  Some database containers were not running"

# Remove only the database volumes
  # Remove only the database volumes
  echo "🗑️  Removing database volumes..."
  VOLUMES_REMOVED=0

  if docker volume rm
  samfundet4_sm4_dev_database 2>/dev/null; then
      echo "✅ samfundet4_sm4_dev_database 
  volume removed"
      VOLUMES_REMOVED=$((VOLUMES_REMOVED + 1))
  else
      echo "⚠️  samfundet4_sm4_dev_database 
  volume not found or couldn't be removed"
  fi

  if docker volume rm
  samfundet4_billig_dev_database 2>/dev/null;
  then
      echo "✅ samfundet4_billig_dev_database 
  volume removed"
      VOLUMES_REMOVED=$((VOLUMES_REMOVED + 1))
  else
      echo "⚠️  samfundet4_billig_dev_database 
  volume not found or couldn't be removed"
  fi

echo ""
if [ $VOLUMES_REMOVED -gt 0 ]; then
    echo "✅ Database volumes destroyed successfully! ($VOLUMES_REMOVED volumes removed)"
    echo "💡 Run 'docker compose up sm4_dev_database billig_dev_database' to recreate the databases."
    echo "💡 You'll need to run migrations after recreating the databases."
else
    echo "⚠️  No database volumes were removed"
fi