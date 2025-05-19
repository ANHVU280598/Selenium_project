# Automate Configurator App

A web application that automates the setup of development environments using Python and Next.js.  
The backend leverages Python (Flask + Selenium), and the frontend is built with Next.js for a modern user interface.

---

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ANHVU280598/Selenium_project.git
cd Selenium_project
```
### 2. Install back end
```bash
cd back_end
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
```
### 3. Install front end
```bash
cd front_end
npm install
```

## Usage
### 1. Run Front End (Next.Js)
```bash
cd front_end
npm next dev
http://localhost:3000 — This is the main user interface for the application.
```
### 2. Run Back End (Flask, Selenium, Swagger)
```bash
cd back_end
# Activate virtual environment
venv\Scripts\activate     # Windows
# or
source venv/bin/activate  # Linux/macOS
# Run the app
python app.py data/automation_app.db

http://localhost:5000/api/docs — This opens the Swagger UI to explore available API endpoints.
```


## Project Structure
```bash
Selenium_project/
├── back_end/
│   ├── data/automation_app.db
│   ├── support_function
│   │     ├── __init__.py
│   │     ├── Helper.py
│   │     └── Load_Driver.py
│   ├── swagger 
│   │   └── full_api.yml 
│   ├── venv/      
│   ├── app.py     
│   ├── db.py     
│   ├── initdb.py 
│   ├── runCode.py     
│   └── requirements.txt       
│
├── front_end/
│   ├── app/
│   │   ├── global.css 
│   │   ├── layout.tsx 
│   │   └── page.tsx    
│   ├── components/
│   │    ├── Action_Menu.tsx 
│   │    ├── Display_Automation_Code.tsx 
│   │    ├── Display_Automation.tsx 
│   │    ├── Display_SopName.tsx 
│   │    ├── Text_Menu.tsx
│   │    └── Xpath_Menu.tsx          
│   └── store/   
│        ├── hooks.ts
│        ├── provider.tsx
│        ├── sopSlice.ts
│        ├── StepSlice.ts
│        └── store.ts          
└── README.md    
```              
