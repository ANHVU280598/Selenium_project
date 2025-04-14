import sqlite3

class DB:
    def __init__(self, db_path="data/automation_app.db"):
        self.db_path = db_path
        self._initialize_db()

    def _connect(self):
        return sqlite3.connect(self.db_path)

    def _initialize_db(self):
        conn = self._connect()
        cursor = conn.cursor()

        # Create tables if not exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Sop (
                SopId INTEGER PRIMARY KEY,
                SopName TEXT NOT NULL UNIQUE
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Setup (
                SetupId INTEGER PRIMARY KEY,
                SopId INTEGER,
                SetupType TEXT CHECK(SetupType IN ('initial', 'final')),
                FOREIGN KEY (SopId) REFERENCES Sop(SopId)
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Action (
                ActionId INTEGER PRIMARY KEY,
                ActionName TEXT NOT NULL
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Step (
                StepId INTEGER PRIMARY KEY,
                StepOrder INTEGER NOT NULL,
                SetupId INTEGER,
                ActionId INTEGER,
                XPath TEXT,
                Text TEXT,
                Timeout INTEGER,
                FOREIGN KEY (SetupId) REFERENCES Setup(SetupId),
                FOREIGN KEY (ActionId) REFERENCES Action(ActionId)
            )
        ''')

        conn.commit()
        conn.close()

    def add_sop(self, sop_name):
        conn = self._connect()
        cur = conn.cursor()
        try:
            cur.execute("INSERT INTO Sop (SopName) VALUES (?)", (sop_name,))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False
        finally:
            conn.close()

    def get_sops(self):
        conn = self._connect()
        cur = conn.cursor()
        cur.execute("SELECT SopId, SopName FROM Sop")
        rows = cur.fetchall()
        conn.close()
        return [{"id": row[0], "name": row[1]} for row in rows]
