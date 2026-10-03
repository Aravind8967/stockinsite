#!/bin/bash

echo "Starting the Stockinsite project using Docker Compose..."
sleep 1

if command -v docker-compose &> /dev/null; then
    docker-compose up -d
elif docker compose version &> /dev/null; then
    docker compose up -d
else
    echo "Error: Docker Compose is not installed."
    exit 1
fi

echo "Stockinsite services are starting up!"
echo "Application URL: http://localhost:5000"
echo "To view logs, run: docker-compose logs -f stockinsite_app"