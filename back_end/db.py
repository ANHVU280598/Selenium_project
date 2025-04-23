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

        # Create the tables with the normalized schema
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
            FOREIGN KEY (SopId) REFERENCES Sop(SopId) ON DELETE CASCADE
        );
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Action (
            ActionId INTEGER PRIMARY KEY,
            ActionName TEXT NOT NULL UNIQUE
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
            Folder_Path TEXT,
            File_Path TEXT,
            Timeout INTEGER,
            FOREIGN KEY (SetupId) REFERENCES Setup(SetupId) ON DELETE CASCADE,
            FOREIGN KEY (ActionId) REFERENCES Action(ActionId)
        );
        ''')


        conn.commit()
        conn.close()
    
    def sop_initial_final(self, sop_name):
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("SELECT SopId FROM Sop WHERE SopName = ?", (sop_name, ))
        sop_id = cursor.fetchone()[0]

        # Now insert into Setup - Initial
        cursor.execute(
                "INSERT OR IGNORE INTO Setup (SopId, SetupType) VALUES (?, ?)",
                (sop_id, "initial")
            )
        # Now insert into Setup - Final
        cursor.execute(
                "INSERT OR IGNORE INTO Setup (SopId, SetupType) VALUES (?, ?)",
                (sop_id, "final")
            )
        conn.commit()
        return True
    
    def add_sop(self, sop_name):
        conn = self._connect()
        cur = conn.cursor()
        try:
            cur.execute("INSERT INTO Sop (SopName) VALUES (?)", (sop_name,))
            conn.commit()
            self.sop_initial_final(sop_name)
            return True
        except sqlite3.IntegrityError:
            return False
        finally:
            conn.close()

    def delete_sop(self, sop_name):
        try:
            conn = sqlite3.connect("data/automation_app.db")
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()

            cursor.execute("DELETE FROM Sop WHERE SopName = ?", (sop_name,))
            conn.commit()

            print(f"SOP '{sop_name}' and related data deleted successfully!")

        except sqlite3.Error as e:
            print("SQLite error:", e)
        finally:
            conn.close()

    def get_sops(self):
        conn = self._connect()
        cur = conn.cursor()
        cur.execute("SELECT SopId, SopName FROM Sop")
        rows = cur.fetchall()
        conn.close()
        return [{"id": row[0], "name": row[1]} for row in rows]

    def add_action(self, action_name):
        try:
            conn = self._connect()
            cursor = conn.cursor()

            cursor.execute("INSERT OR IGNORE INTO Action (ActionName) VALUES (?)", (action_name,))
            conn.commit()

            print(f"Action '{action_name}' added (or already exists).")

        except sqlite3.Error as e:
            print("SQLite error:", e)
        finally:
            conn.close()
    
    def delete_action(self, action_name):
        conn = self._connect()
        cur = conn.cursor()
        cur.execute("DELETE FROM Action WHERE ActionName = ?", (action_name,))
        conn.commit()
        print(f"Delete {action_name} successfull")
        
    def add_step(self, sop_name, setup_type, action_name, xpath=None, text=None, folder_path =None, file_name = None, timeout=None):
        try:
            conn = self._connect()
            cur = conn.cursor()

            # Enable foreign keys (good practice)
            cur.execute("PRAGMA foreign_keys = ON")

            # 1. Get SopId from sop_name
            cur.execute("SELECT SopId FROM Sop WHERE SopName = ?", (sop_name,))
            sop_row = cur.fetchone()
            if not sop_row:
                raise ValueError(f"SOP '{sop_name}' does not exist")
            sop_id = sop_row[0]
            
            # 2. Get SetupId from sop_id and setup_type
            cur.execute("SELECT SetupId FROM Setup WHERE SopId = ? AND SetupType = ?", (sop_id, setup_type))
            setup_row = cur.fetchone()
            if not setup_row:
                raise ValueError(f"Setup '{setup_type}' for SOP '{sop_name}' does not exist")
            setup_id = setup_row[0]

            # Get Step Order
            step_order = self.get_highest_step_order(sop_id, setup_id) + 1


            # 3. Get ActionId from action_name
            cur.execute("SELECT ActionId FROM Action WHERE ActionName = ?", (action_name,))
            action_row = cur.fetchone()
            if not action_row:
                raise ValueError(f"Action '{action_name}' does not exist")
            action_id = action_row[0]

            # 4. Insert the step
            cur.execute('''
                INSERT INTO Step (StepOrder, SetupId, ActionId, XPath, Text, Folder_Path, File_Path, Timeout)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (step_order, setup_id, action_id, xpath, text, folder_path, file_name,  timeout))

            conn.commit()
            return "Step added successfully"

        except Exception as e:
            return f"Error adding step: {e}"

        finally:
            conn.close()
    
    def update_step_value(self, stepId, actionName, xpath='None', text='None', folder_path='None', file_name='None'):
        try:
            conn = self._connect()
            cur = conn.cursor()

            cur.execute("SELECT ActionId FROM Action WHERE ActionName = ?", (actionName,))
            action_row = cur.fetchone()
            if not action_row:
                raise ValueError(f"Action '{actionName}' does not exist")
            action_id = action_row[0]
            print(f'stepID {stepId}')
            print(f'actionName {actionName}')
            print(f'xpath {xpath}')
            print(f'text {text}')
            print(f'folder_path {folder_path}')
            print(f'file_name {file_name}')
            # 4. Update Step table
            cur.execute("""
                UPDATE Step
                SET ActionId = ?, XPath = ?, Text = ?, Folder_Path = ?, File_Path = ?
                WHERE StepId = ?
            """, (action_id, xpath, text, folder_path, file_name, stepId))


            conn.commit()
            return "update step successfull"

        except Exception as e:
            return f"Error adding step: {e}"

        finally:
            conn.close()

    def get_actions(self):
        conn = self._connect()
        cur = conn.cursor()
        cur.execute("SELECT ActionId ,ActionName FROM Action")
        rows = cur.fetchall()
        conn.close()
        return [{"id": row[0], "name": row[1]} for row in rows]

    def get_all_step(self, sop_name, setup_type):
        conn = self._connect()
        cur = conn.cursor()

        cur.execute("SELECT SopId FROM Sop WHERE SopName = ?", (sop_name,))
        sop_row = cur.fetchone()
        if not sop_row:
            raise ValueError(f"SOP '{sop_name}' does not exist")
        
        sop_id = sop_row[0]


        cur.execute("SELECT SetupId FROM Setup WHERE SopId = ? AND SetupType = ?", (sop_id, setup_type))
        setup_id_rows = cur.fetchone()
        if not setup_id_rows:
            raise ValueError(f"Setup '{setup_type}' for SOP '{sop_id}' does not exist")

        setup_id = setup_id_rows[0]
        
        # Join Step and Action to get ActionName
        cur.execute("""
            SELECT Step.StepId, Step.StepOrder, Step.SetupId, Step.ActionId, Step.XPath, Step.Folder_Path, Step.File_Path, Step.Text, Step.Timeout, 
                Action.ActionName
            FROM Step
            JOIN Action ON Step.ActionId = Action.ActionId
            WHERE Step.SetupId = ?
            ORDER BY Step.StepOrder ASC
        """, (setup_id,))

        rows = cur.fetchall()
        result = [dict(zip([column[0] for column in cur.description], row)) for row in rows]

        conn.close()
        return result

    def get_highest_step_order(self, sop_id, setup_id):
        try:
            conn = self._connect()
            cur = conn.cursor()

            query = '''
            SELECT MAX(Step.StepOrder)
            FROM Step
            JOIN Setup ON Step.SetupId = Setup.SetupId
            WHERE Setup.SopId = ? AND Step.SetupId = ?
            '''
            cur.execute(query, (sop_id, setup_id))
            result = cur.fetchone()

            return result[0] if result[0] is not None else 0

        except sqlite3.Error as e:
            print("Database error:", e)
            return None
        except Exception as e:
            print("Unexpected error:", e)
            return None
        finally:
            if 'conn' in locals():
                conn.close()

    def delete_step(self, stepOrder, setupId):
        conn = self._connect()
        cur = conn.cursor()
        cur.execute("DELETE FROM Step WHERE StepOrder = ? AND SetupId = ?", (stepOrder, setupId))


        # Step 2: Update the StepOrder of subsequent steps
        cur.execute("""
            UPDATE Step
            SET StepOrder = StepOrder - 1
            WHERE StepOrder > ? AND SetupId = ?
        """, (stepOrder, setupId))

        conn.commit()
        print(f"Delete SetupId: {setupId} & StepOrder: {stepOrder} successfull")