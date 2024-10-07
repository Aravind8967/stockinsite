import mysql
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

class companies:
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

    def search_by_name(self, c_name):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM COMPANIES WHERE C_NAME = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (c_name, ))
            data = cursor.fetchall()
            if len(data) == 0:
                return {'status':404, 'data':'company not found'}
            else:
                return {'status':200, 'data':data}
        else:
            return {"status":404, "data":'database connection error'}

if __name__ == '__main__':
    c = companies()
    print(c.search_by_name('dsa'))