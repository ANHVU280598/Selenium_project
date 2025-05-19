from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def get_driver():
    options = Options()
    # Add any options you want, or leave empty if none needed
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--allow-insecure-localhost")
    # options.add_argument("--headless")  # Uncomment if you want headless mode

    # No custom path specified, just use default chromedriver found in PATH
    service = Service()  # This assumes chromedriver is in your PATH

    driver = webdriver.Chrome(service=service, options=options)
    return driver
