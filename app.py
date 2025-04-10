import os
import webview
from jinja2 import Environment, FileSystemLoader
from db import db_operation1

def load_css(window):
    # Get the absolute path to the CSS file based on the current script's directory
    base_dir = os.path.abspath(os.path.dirname(__file__))
    print(base_dir)
    css_path = os.path.join(base_dir, "static", "css", "tailwind.min.css")
    print(css_path)
    # Read the CSS file
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
    
    # Load the CSS content into the window
    window.load_css(css_content)

def create_window():
    # Load SOP names from database
    sop_names = db_operation1.get_all_sop_names()

    # Setup Jinja2
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('index.html')

    # Render HTML with dynamic SOP names
    html_content = template.render(sop_names=sop_names)

    # Create window using the rendered HTML
    window = webview.create_window("DRB", html=html_content)

    # Start the window and load the CSS
    webview.start(load_css, window)

if __name__ == '__main__':
    create_window()
