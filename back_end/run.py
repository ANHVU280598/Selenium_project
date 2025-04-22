from support_function import DataLoader, Helper, Load_Driver
import sys
import time
import os

# Default data directory
default_dir = "data"

# Check if file path is passed
if len(sys.argv) > 1:
    file_path = sys.argv[1]
    # If no directory is in the path, assume it's under 'data/'
    if not os.path.dirname(file_path):
        file_path = os.path.join(default_dir, file_path)
else:
    file_path = os.path.join(default_dir, "SA6116.csv")

# Check if the file exists
if not os.path.isfile(file_path):
    print(f"[ERROR] File not found: {file_path}")
    sys.exit(1)

print(f"[INFO] Using file: {file_path}")

# Load data and start driver
data = DataLoader.load_data(file_path)
driver = Load_Driver.get_driver()

# Perform actions
for index, row in data.iterrows():
    action = row["action"]
    xpath = row["xpath"]
    text = row["text"]

    if Helper.__perform_action(driver, xpath, action, text):
        pass
    else:
        break

# Keep session alive
try:
    print("[INFO] Automation done. Keeping session alive...")
    time.sleep(12000)
finally:
    driver.quit()
