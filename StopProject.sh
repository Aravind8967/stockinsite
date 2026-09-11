DB_CONT="stockinsite"

DB_STATUS=$(docker ps --filter "name=$DB_CONT" --format "{{.Names}}")
PY_PID=$(ps -ef | grep python | awk '{print $2}')


if [ "$DB_STATUS" == "$DB_CONT" ]; then
    docker stop "$DB_CONT"
    sleep 3
    echo "$DB_CONT container stoppend"
fi

sleep 2
echo " Stopping the application server "
sleep 5

if [ "$PY_PID" ]; then
    echo "Python is running"
    kill -9 "$PY_PID"
    sleep 2
    echo "Python process stopped"
fi
sleep 5

echo '' > app.log

echo "Project stopped"