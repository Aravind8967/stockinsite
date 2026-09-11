#!/bin/bash

DB_CONT="stockinsite"
OLLAMA_CONT="stockinsite_ollama"

# Get exact matches for container names
DB_STATUS=$(docker ps --filter "name=${DB_CONT}$" --format "{{.Names}}")
OLLAMA_STATUS=$(docker ps --filter "name=${OLLAMA_CONT}$" --format "{{.Names}}")

# Stop DB container first
if [ "$DB_STATUS" = "$DB_CONT" ]; then
    echo "$DB_CONT is running..."
    docker stop "$DB_CONT"
    sleep 3
    echo "$DB_CONT container stopped"
fi

# Then stop Ollama container
if [ "$OLLAMA_STATUS" = "$OLLAMA_CONT" ]; then
    echo "$OLLAMA_CONT is running..."
    docker stop "$OLLAMA_CONT"
    sleep 3
    echo "$OLLAMA_CONT container stopped"
fi

# Stop Python process if running
PY_PID=$(ps -ef | grep python | grep -v grep | awk '{print $2}')
echo "Stopping the application server..."
if [ -n "$PY_PID" ]; then
    echo "Python is running with PID $PY_PID"
    kill -9 "$PY_PID"
    sleep 3
    echo "Python process stopped"
fi

# Clear logs
> app.log

echo "Project stopped"
