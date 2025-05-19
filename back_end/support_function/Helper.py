import subprocess
import platform
import time
import requests
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def get_file_path(file_path):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, "..", ".."))
    config_file_path = os.path.abspath(os.path.join(project_root, file_path))

    print(f"Full config file path: {config_file_path}")

    if os.path.exists(config_file_path):
        print("File exists:", config_file_path)
    else:
        print("File NOT found:", config_file_path)

    return config_file_path

def search_file_path(file_name):
    search_path = '../ConfigureFiles'
    for root, dirs, files in os.walk(search_path):
        if file_name in files:
            full_path = os.path.join(root, file_name)
            full_path = os.path.abspath(full_path)
            print(f"full path {full_path}")
            if os.path.exists(full_path):
                print("File exists:", full_path)
                return full_path
            else:
                print("File NOT found:", full_path)
            

def wait_for_device_webpage(driver, url, action, timeout=300, interval=5):
    """Waits for the device's default web page to be accessible."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        print(f"Wait for {url}")
        try:
            response = requests.get(url, timeout=3, verify=False)
            time.sleep(3)
            if response.status_code == 200:
                print(f"Device page is now available: {url}")
                if action == "ping":
                    driver.get(url)
                elif action == "get":
                    driver.get(url)

                return True
        except requests.ConnectionError:
            print(f"Waiting for {url} to be available...")

        time.sleep(interval)  # Wait before retrying

    # raise Exception(f"Device webpage did not become available within {timeout} seconds.")
    return False

def wait_for_element_presence(driver, xpath):
    try:
        el = WebDriverWait(driver, 300).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )
        print(f"el available {xpath}")
        return el
    except Exception as e:
        print(f"Error: {xpath}")
    return False

def wait_for_element_visible(driver, xpath):
    try:
        el = WebDriverWait(driver, 300).until(
            EC.visibility_of_element_located((By.XPATH, xpath))
        )
        print(f"el available {xpath}")
        return el
    except Exception as e:
        print(f"Error: {xpath}")
    return False

def perform_action(driver, xpath, action, text=None):
    """
    Perform an action on a web element after ensuring it's visible.
    Actions can be "ping", "get", "enter", or "click".
    
    :param driver: WebDriver instance
    :param xpath: XPath of the target element
    :param action: The action to perform ("ping", "get", "enter", "click")
    :param text: Optional text for "enter" and "click" actions
    :return: True if action was successful, False otherwise
    """
    
    # Check if action is ping or get and if device page is accessible
    if action in ["ping", "get"] and wait_for_device_webpage(driver,xpath,action):
        return True
    
    # Wait for the element to be visible
    if action != 'done':
        result = wait_for_element_presence(driver, xpath)
        if result:
            # Handle "enter" action (send text input)
            if action == "enter" and text:
                try:
                    result = WebDriverWait(driver, 1000).until(
                        EC.element_to_be_clickable((By.XPATH, xpath))
                    )
                    result.send_keys(text)
                except Exception as e:
                    print(f"Error occurred: {e}")
                print(f"Entered text: {text}")
                return True
            
            # Handle "click" action
            elif action == "click":
                # result.click()
                # print(f'Clicked the element: {xpath}')
                try:
                    button = WebDriverWait(driver, 1000).until(
                        EC.element_to_be_clickable((By.XPATH, xpath))
                    )
                    button.click()
                    print(f"Clicked the button at {xpath}")
                except Exception as e:
                    print(f"Error occurred: {e}")
                return True
            
            elif action =="upload":
                print(text)
                file_path = search_file_path(text)
                print(f"file Path {file_path}")
                result.send_keys(file_path)
                return True
            
            
            elif action =="wait":
                if wait_for_element_visible(driver, xpath):
                    return True
            
    if action =="done":
        script = f"""
        let div = document.createElement('div');
        div.innerText = '{text}';
        div.style.position = 'fixed';
        div.style.top = '10%';
        div.style.left = '10%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.color = 'limegreen';
        div.style.fontSize = '46px';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.zIndex = '9999';
        div.style.backgroundColor = 'black';
        div.style.padding = '20px';
        div.style.borderRadius = '20px';
        document.body.appendChild(div);
        """
        driver.execute_script(script)

        
    return False




