import os
import unittest

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("SELENIUM_BASE_URL", "http://127.0.0.1:8080")


class AuthFlowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,900")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        cls.driver = webdriver.Chrome(options=options)
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def open_login_page(self):
        self.driver.get(f"{BASE_URL}/")
        self.driver.execute_script("window.localStorage.clear();")
        self.driver.get(f"{BASE_URL}/")
        self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
        )

    def open_register_page(self):
        self.open_login_page()
        sign_up_link = self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign up"))
        )
        sign_up_link.click()
        self.wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Create account')]")
            )
        )

    def test_login_required_field_validation(self):
        self.open_login_page()

        submit_btn = self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_btn.click()

        self.wait.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Email is required')]")))
        self.wait.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Password is required')]")))

    def test_register_short_password_validation(self):
        self.open_register_page()

        name_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
        )
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")

        name_input.clear()
        name_input.send_keys("Selenium User")

        email_input.clear()
        email_input.send_keys("selenium.user@example.com")

        password_input.clear()
        password_input.send_keys("123")

        submit_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_btn.click()

        self.wait.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Min 6 characters')]")))

    def test_auth_navigation_links(self):
        self.open_login_page()

        self.open_register_page()

        sign_in_link = self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign in"))
        )
        sign_in_link.click()

        self.wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Welcome back')]")
            )
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
