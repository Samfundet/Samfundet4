#!/bin/bash

set -e

# Define media directories to clean
IMAGES_DIR="backend/mediaroot/images"
UPLOADS_DIR="backend/mediaroot/uploads"

echo "🗑️ MEDIA FILES DESTRUCTION WARNING 🗑️"
echo ""
echo "This will NOT affect:"
echo "  - Running containers"
echo "  - Database volumes"
echo "  - Built images"
echo "  - Networks"
echo ""
echo "⚠️  All media files will be permanently lost!"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo
echo "This will destroy ONLY Docker-generated media files:"
echo "  - ${IMAGES_DIR}/* (all image files)"
echo "  - ${UPLOADS_DIR}/* (all upload files)"

if [[ ! $REPLY == "yes" ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo "🚀 Starting media files destruction..."

echo "🗑️  Cleaning up Docker-generated media files..."
FILES_CLEANED=0

if [ -d "$IMAGES_DIR" ] && [ "$(ls -A "$IMAGES_DIR" 2>/dev/null)" ]; then
    if sudo rm -rf "$IMAGES_DIR"/*; then
        echo "✅ Images cleaned successfully"
        FILES_CLEANED=1
    else
        echo "❌ Failed to clean images (may require sudo permissions)"
    fi
else
    echo "⚠️  No images to clean"
fi

if [ -d "$UPLOADS_DIR" ] && [ "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
    if sudo rm -rf "$UPLOADS_DIR"/*; then
        echo "✅ Uploads cleaned successfully"
        FILES_CLEANED=1
    else
        echo "❌ Failed to clean uploads (may require sudo permissions)"
    fi
else
    echo "⚠️  No uploads to clean"
fi

echo ""
if [ $FILES_CLEANED -eq 1 ]; then
    echo "✅ Media files destroyed successfully!"
    echo "💡 Media files will be regenerated when needed by the application."
else
    echo "⚠️  No media files were cleaned"
fi