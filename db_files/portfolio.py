import mysql
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = os.getenv('DB_PORT')


class portfolio:
    def db_connection(self):
        try:
            db_connection = mysql.connector.connect(
                host = DB_HOST,
                user = DB_USER,
                password = DB_PASSWORD,
                database = DB_NAME,
                port = DB_PORT
            )
            status = 200
            return {'connection':db_connection, 'status':status}
        except:
            status = 404
            return {'status':status, 'data':'database connection error'}

    def get_all_data(self):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM portfolio"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q)
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}
        
    def is_present(self, c_symbol, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM portfolio WHERE c_symbol = %s AND u_id = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (c_symbol, u_id))
            data = cursor.fetchall()
            if data: 
                return True
            else:
                return False
            
    def add_company(self, data):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                if not self.is_present(data['c_symbol'], data['u_id']):
                    q = "INSERT INTO portfolio (u_id, c_symbol, quantity, bought_price) VALUES (%s, %s,%s, %s)"
                    cursor = con.cursor(dictionary=True)
                    cursor.execute(q, (data['u_id'], data['c_symbol'], data['quantity'], data['bought_price']))
                    db['connection'].commit()
                    return {'status':200, 'data':'company added succesfully'}
                else:
                    return {'status':404, 'data':'company already present in portfolio'}
            else:
                return {'status':404, 'data':'database connection error'}
        except:
            return {'status':404, 'data':'database connection error'}

    def remove_company(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "DELETE FROM portfolio WHERE c_symbol = %s AND u_id = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (data['c_symbol'], data['u_id']))
            db['connection'].commit()
            return {'status':200, 'data':'company removed succesfully'}
        else:
            return {'status':404, 'data':'database connection error'}
        
    def get_data_by_userID(self, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM portfolio WHERE u_id = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q,(u_id,))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {'status':404, 'data':'database connection error'}
        
    def update_company(self, data):
        db = self.db_connection()
        if db["status"] == 200:
            con = db["connection"]
            cursor = con.cursor()
            q = "UPDATE portfolio SET quantity = %s, bought_price = %s WHERE u_id = %s AND c_symbol = %s"
            cursor.execute(q, (data['quantity'], data['bought_price'], data['u_id'], data['c_symbol']))
            con.commit()
            return {'status':200, 'data':'Company data updated'}
        else:
            return {'status':404, 'data':'Not able to'}


        
    def delete_all_data_by_user(self, u_id):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                q = "DELETE FROM portfolio WHERE u_id = %s"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (u_id,))
                con.commit()
                return {'status':200, 'data':'portfolio cleared successfully'}
        except:
                return {'status':404, 'data':'something went wrong'}
        else:
            return {'status':404, 'data':'company name not found'}

    def clear_portfolio(self):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                q = "TRUNCATE TABLE portfolio"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q)
                con.commit()
                return {'status':200, 'data':'portfolio cleared successfully'}
        except:
                return {'status':404, 'data':'portfolio clear error'}
        else:
            return {'status':404, 'data':'database connection error'}


def get_all_data():
    pf = portfolio()
    portfolio_all_data = pf.get_all_data()
    for val in portfolio_all_data['data']:
        print(val)    

def insert_data(data):
    pf = portfolio()
    print(pf.add_company(data))

def remove_data(data):
    pf = portfolio()
    print(pf.remove_company(data))

def get_data_by_user(u_id):
    pf = portfolio()
    data = pf.get_data_by_userID(u_id)
    for val in data['data']:
        print(val)

def update(data):
    pf = portfolio()
    data = pf.update_company(data)
    print(data)

def clear_table():
    pf = portfolio()
    print(pf.clear_portfolio())

def del_by_u_id(u_id):
    pf = portfolio()
    print(pf.delete_all_data_by_user(u_id))



if __name__ == '__main__':
    port = portfolio()
    data = {
        'u_id': 4,
        'c_symbol' : 'JIOFIN',
        'quantity' : 10,
        'bought_price' : 4567
    }
    (data)