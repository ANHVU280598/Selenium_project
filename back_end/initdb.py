import sqlite3

# Connect to SQLite database (will create it if it doesn't exist)
conn = sqlite3.connect(r'data/automation_app.db')
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
    Timeout INTEGER,
    FOREIGN KEY (SetupId) REFERENCES Setup(SetupId) ON DELETE CASCADE,
    FOREIGN KEY (ActionId) REFERENCES Action(ActionId)
);
''')

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database and tables created successfully!")
