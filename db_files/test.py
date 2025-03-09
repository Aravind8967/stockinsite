import mysql
import mysql.connector
import os
from dotenv import load_dotenv

DB_HOST='localhost'
DB_PORT=3306
DB_NAME='website'
DB_USER='vm2'
DB_PASSWORD='Aru.8967'

# DB_HOST = os.getenv('DB_HOST')
# DB_NAME = os.getenv('DB_NAME')
# DB_USER = os.getenv('DB_USER')
# DB_PASSWORD = os.getenv('DB_PASSWORD')

class Database:
    def db_connection(self):
        try:
            db_connection = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
            status = 200
            return {'connection':db_connection, 'status':status}
        except:
            status = 404
            return {'status':status, 'data':'database connection error'}
    
if __name__ == '__main__':
    db = Database()
    print(db.db_connection())