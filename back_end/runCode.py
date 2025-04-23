from support_function import Helper, Load_Driver
import sys
import time
import os


class RunCode():
    def __init__ (self):

        self.driver = Load_Driver.get_driver()

    def start(self, all_steps):
        for objAction in all_steps:
            action = objAction['ActionName']
            xpath = objAction['XPath']
            text = objAction['Text']
            print(xpath)

            if Helper.perform_action(self.driver, xpath, action, text):
                pass
        print("Run Code Complete")

