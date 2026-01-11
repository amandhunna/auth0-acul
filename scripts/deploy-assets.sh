#!/bin/bash

# Script to deploy dist folder to GitHub Pages for Auth0 ACUL hosting

set -e

echo "🔨 Building project..."
npm run build

echo "📦 Preparing assets for deployment..."

# Create a temporary directory for the deployment
DEPLOY_DIR=".deploy"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy dist folder
cp -r dist/* $DEPLOY_DIR/

# Create a .nojekyll file to prevent Jekyll processing
touch $DEPLOY_DIR/.nojekyll

echo "✅ Assets prepared in $DEPLOY_DIR"
echo "💡 Next steps:"
echo "   1. Commit and push $DEPLOY_DIR to a gh-pages branch"
echo "   2. Enable GitHub Pages in repo settings"
echo "   3. Update Auth0 config with GitHub Pages URL"

