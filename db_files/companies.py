from flask import json
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
            q = "SELECT * FROM companies WHERE c_name = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (c_name, ))
            data = cursor.fetchall()
            if len(data) == 0:
                return {'status':404, 'data':'company not found'}
            else:
                return {'status':200, 'data':data}
        else:
            return {"status":404, "data":'database connection error'}

    def insert_company(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            try:
                con = db['connection']
                q = "INSERT INTO companies (c_id, c_symbol, c_name, marketcap) VALUES (%s, %s, %s, %s);"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (data['c_id'],data['c_symbol'], data['c_name'], data['marketcap']))
                db['connection'].commit()
                return {'status':200, 'data':'New user created'}
            except:
                return {'status':404, 'data':'Not able to create new user'}
        else:
            return {'status':404, 'data':'database connection error'}


if __name__ == '__main__':
    c_class = companies()
    with open('./companies_list.json', 'r') as file:
        data = json.load(file)
        for company in data:
            print(company)
            c_class.insert_company(company)