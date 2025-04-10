import sqlite3

# Function to connect to the database

def connect_db():
    return sqlite3.connect(r'data/automation_app.db')

def get_cursor():
    conn = connect_db()
    cursor = conn.cursor()
    return conn, cursor

def get_all_sop_names():
    conn, cursor = get_cursor()
    cursor.execute('''SELECT SopName FROM Sop''')
    results = cursor.fetchall()
    conn.close()

    sop_names = [row[0] for row in results]  # Each row is a tuple, row[0] is the SopName
    return sop_names


# Function to add a new Sop
def add_sop(sop_name):
    sops_names = get_all_sop_names()
    if sop_name not in sops_names:
        conn, cursor = get_cursor()
        cursor.execute('''
        INSERT INTO Sop (SopName)
        VALUES (?)
        ''', (sop_name,))
        conn.commit()
        conn.close()
        print("Insert Data Successfull")
        return True
    else:
        print(f'Sop name: {sop_name} is already existed!!!') 
    return False