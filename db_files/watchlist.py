import mysql
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

class watchlist:
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
        
    def is_present(self, c_name, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM WATCHLIST WHERE C_NAME = %s AND U_ID = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (c_name, u_id))
            data = cursor.fetchall()
            if data: 
                return True
            else:
                return False

    def get_all_data(self):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM WATCHLIST"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q)
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}
    
    def add_company(self, data):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                if not self.is_present(data['c_name'], data['u_id']):
                    q = "INSERT INTO WATCHLIST (C_NAME, U_ID, share_price, c_symbol) VALUES (%s, %s,%s, %s)"
                    cursor = con.cursor(dictionary=True)
                    cursor.execute(q, (data['c_name'], data['u_id'], data['share_price'],data['c_symbol']))
                    db['connection'].commit()
                    return {'status':200, 'data':'company added succesfully'}
                else:
                    return {'status':404, 'data':'company already present in watchlist'}
            else:
                return {'status':404, 'data':'database connection error'}
        except:
            return {'status':404, 'data':'database connection error'}
            

    def remove_company(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "DELETE FROM WATCHLIST WHERE C_SYMBOL = %s AND U_ID = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (data['c_symbol'], data['user_id']))
            db['connection'].commit()
            return {'status':200, 'data':'company removed succesfully'}
        else:
            return {'status':404, 'data':'database connection error'}

    def clear_watchlist(self):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                q = "TRUNCATE TABLE WATCHLIST"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q)
                con.commit()
                return {'status':200, 'data':'Watchlist cleared successfully'}
        except:
                return {'status':404, 'data':'Watchlist clear error'}
        else:
            return {'status':404, 'data':'database connection error'}

    def get_data_by_userID(self, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM WATCHLIST WHERE U_ID = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q,(u_id,))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {'status':404, 'data':'database connection error'}

    def get_data_by_cname(self, c_name, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM WATCHLIST WHERE C_NAME = %s AND U_ID = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q,(c_name,u_id))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {'status':404, 'data':'database connection error'}

    def update_u_id(self,name, id):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                q = "UPDATE WATCHLIST SET U_ID = %s WHERE C_NAME = %s"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (id, name))
                con.commit()
                return {'status':200, 'data':'Watchlist updated successfully'}
        except:
                return {'status':404, 'data':'company name not found'}
        else:
            return {'status':404, 'data':'company name not found'}

    def delete_all_data_by_user(self, u_id):
        db = self.db_connection()
        try:
            if db['status'] == 200:
                con = db['connection']
                q = "DELETE FROM WATCHLIST WHERE U_ID = %s"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (u_id,))
                con.commit()
                return {'status':200, 'data':'Watchlist cleared successfully'}
        except:
                return {'status':404, 'data':'something went wrong'}
        else:
            return {'status':404, 'data':'company name not found'}


def add(name, id):
    watch = watchlist()
    data = {
        'c_name':name,
        'u_id':id
    }
    print(watch.add_company(data))    

def all():
    watch = watchlist()
    d = watch.get_all_data()['data']
    for i in d:
        print(i)   

def remove(name, id):
    watch = watchlist()
    data = {
        'c_symbol':name,
        'u_id':id
    }
    print(watch.remove_company(data))

def truncate():
    watch = watchlist()
    print(watch.clear_watchlist())

def update_id(name, id):
    watch = watchlist()
    print(watch.update_u_id(name, id))

def get_by_id(id):
    watch = watchlist()
    data =  watch.get_data_by_userID(id)['data']
    for i in data:
        print(i)

def get_by_name(name, id):
    watch = watchlist()
    data = watch.get_data_by_cname(name, id)['data']
    print(data)

if __name__ == '__main__':
    get_by_id(8)