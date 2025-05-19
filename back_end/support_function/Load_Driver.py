from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def get_driver():
    # Set up Chrome options
    options = Options()

    # ✅ Path to your custom Chrome binary (e.g., a portable version)
    options.binary_location = r".\PortableApps\GoogleChromePortable64\App\Chrome-bin\chrome.exe"

    # Optional: Add arguments
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--allow-insecure-localhost")
    # options.add_argument("--headless")  # Uncomment for headless mode

    # ✅ Path to your custom ChromeDriver executable
    custom_driver_path = r".\PortableApps\GoogleChromePortable64\App\Chrome-bin\chromedriver.exe"

    # Use the custom ChromeDriver path
    service = Service(executable_path=custom_driver_path)

    # Initialize the driver
    driver = webdriver.Chrome(service=service, options=options)
    return driver

# Run and test