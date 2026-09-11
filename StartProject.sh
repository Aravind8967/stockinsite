DB_CONT="stockinsite"
OLLAMA_CONT="stockinsite_ollama"

echo "Starting the project"
sleep 2

echo "Downloading the python dependencies"
sleep 2

echo "python requirments are installed"


DB_STATUS=$(docker ps -a --filter "name=${DB_CONT}$" --format "{{.Names}}")
OLLAMA_STATUS=$(docker ps -a --filter "name=${OLLAMA_CONT}$" --format "{{.Names}}")

# ========================= Database staring process =================================

if [ "$DB_STATUS" == "$DB_CONT" ]; then
  echo "$DB_STATUS container found starting the container"
  docker start "$DB_CONT"
  sleep 3
  echo "$DB_CONT container started"
fi

# ========================= Database staring process =================================


if [ "$OLLAMA_STATUS" == "$OLLAMA_CONT" ]; then
  echo "$OLLAMA_STATUS container found starting the container"
  docker start "$OLLAMA_CONT"
  sleep 3
  echo "$OLLAMA_CONT container started"
fi

sleep 5

echo "Starting the application Server"
sleep 2

nohup python wsig.py > app.log 2>&1 &

sleep 10
echo " application Server started "
echo " CMD :- tail -f app.log "