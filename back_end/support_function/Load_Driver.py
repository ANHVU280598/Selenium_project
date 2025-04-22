from seleniumbase import Driver

def get_driver():
    driver = Driver(uc=True, headless=False, disable_ws=True)
    return driver