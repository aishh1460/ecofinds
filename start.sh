#!/usr/bin/env bash
set -e

echo "🐳 Starting EcoFinds with Docker..."
echo "This will download some files from the internet the first time."

docker compose up --build
