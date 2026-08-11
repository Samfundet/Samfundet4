#!/bin/bash

set -e

echo "☢️ DESTRUCTIVE OPERATION WARNING ☢️"
echo "This will destroy your ENTIRE local development environment including:"
echo "  - All containers (backend, frontend, databases, storybook)"
echo "  - All volumes (sm4_dev_database, billig_dev_database)"
echo "  - All networks"
echo "  - All built images"
echo "  - All Docker-generated media files"
echo ""
echo "This action cannot be undone!"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo

if [[ ! $REPLY == "yes" ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo "🚀 Starting destruction of entire development environment..."

echo "📦 Stopping and removing containers, volumes, and networks..."
if docker compose down -v --remove-orphans; then
    echo "✅ Containers, volumes, and networks removed successfully"
else
    echo "❌ Failed to remove containers/volumes/networks"
    exit 1
fi

echo "🧹 Removing project-specific images..."
docker compose down --rmi all 2>/dev/null || echo "⚠️  No images to remove or couldn't remove them"

./scripts/dev-local-destroy-media.sh

echo ""
echo "✅ Development environment destroyed successfully!"
echo "💡 Run 'docker compose up --build' to recreate the environment."