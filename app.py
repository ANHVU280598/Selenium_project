# app.py
import webview
from jinja2 import Environment, FileSystemLoader

def create_window():
    # Data for buttons, this could come from a database, file, etc.
    buttons_data = ["Button 1", "Button 2", "Button 3", "Button 4", "Button 5"]
    
    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('index.html')
    
    # Render the template with dynamic buttons data
    html_content = template.render(buttons=buttons_data)

    # Create and start the PyWebView window
    webview.create_window("Automation Web Interface", html=html_content)
    webview.start()

if __name__ == '__main__':
    create_window()  # Run PyWebView in the desktop app
