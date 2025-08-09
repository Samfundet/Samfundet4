#!/bin/bash

set -e

echo "☢️ DESTRUCTIVE OPERATION WARNING ☢️"
echo "This will destroy your local development environment including:"
echo "  - All containers (backend, frontend, databases, storybook)"
echo "  - All volumes (sm4_dev_database, billig_dev_database)"
echo "  - All networks"
echo "  - All built images"
echo ""
echo "This action cannot be undone!"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo

if [[ ! $REPLY == "yes" ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo "🚀 Starting destruction of development environment..."

echo "📦 Stopping and removing containers, volumes, and networks..."
if docker compose down -v --remove-orphans; then
    echo "✅ Containers, volumes, and networks removed successfully"
else
    echo "❌ Failed to remove containers/volumes/networks"
    exit 1
fi

echo "🧹 Removing project-specific images..."
docker compose down --rmi all 2>/dev/null || echo "⚠️  No images to remove or couldn't remove them"

echo "🗑️  Cleaning up Docker-generated media files..."
if [ -d "backend/mediaroot/images" ] && [ "$(ls -A backend/mediaroot/images 2>/dev/null)" ]; then
    if sudo rm -rf backend/mediaroot/images/*; then
        echo "✅ Images cleaned successfully"
    else
        echo "❌ Failed to clean images (may require sudo permissions)"
    fi
else
    echo "⚠️  No images to clean"
fi

if [ -d "backend/mediaroot/uploads" ] && [ "$(ls -A backend/mediaroot/uploads 2>/dev/null)" ]; then
    if sudo rm -rf backend/mediaroot/uploads/*; then
        echo "✅ Uploads cleaned successfully"
    else
        echo "❌ Failed to clean uploads (may require sudo permissions)"
    fi
else
    echo "⚠️  No uploads to clean"
fi

echo ""
echo "✅ Development environment destroyed successfully!"
echo "💡 Run 'docker compose up --build' to recreate the environment."