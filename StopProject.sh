#!/bin/bash

echo "Stopping the Stockinsite project using Docker Compose..."
sleep 1

if command -v docker-compose &> /dev/null; then
    docker-compose down
elif docker compose version &> /dev/null; then
    docker compose down
else
    echo "Error: Docker Compose is not installed."
    exit 1
fi

echo "All Stockinsite containers stopped."
