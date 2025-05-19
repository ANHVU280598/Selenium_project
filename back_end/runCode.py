from support_function import Helper, Load_Driver
import time

# This must be declared in the main file and imported here if needed.
# We'll assume it will be passed in during initialization for better practice.

class RunCode():
    def __init__(self, stop_flag_ref):
        self.driver = Load_Driver.get_driver()
        self.stop_flag_ref = stop_flag_ref  # pass a callable to check the stop flag

    def start(self, all_steps):
        for objAction in all_steps:
            if self.stop_flag_ref():
                print("Graceful stop requested. Exiting RunCode loop.")
                break

            action = objAction['ActionName']
            xpath = objAction['XPath']
            text = objAction['Text']
            folder_path = objAction['Folder_Path']
            file_name = objAction['File_Path']

            file_path = folder_path + file_name
            print(file_path)

            if action == "upload":
                text = file_name

            if Helper.perform_action(self.driver, xpath, action, text):
                pass

        # Avoid long sleep if we are stopping
        sleep_duration = 100000
        for _ in range(sleep_duration):
            if self.stop_flag_ref():
                print("Sleep interrupted by stop flag.")
                break
            time.sleep(1)

        self.driver.close()
        print("Run Code Complete")
