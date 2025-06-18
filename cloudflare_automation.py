#!/usr/bin/env python3
"""
Cloudflare DNS Automation Script
Attempts to automate adding DNS records through browser automation
"""

import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.safari.options import Options as SafariOptions

def setup_driver():
    """Set up browser driver"""
    try:
        # Try Safari first (pre-installed on macOS)
        safari_options = SafariOptions()
        driver = webdriver.Safari(options=safari_options)
        print("✅ Using Safari driver")
        return driver
    except Exception as e:
        print(f"❌ Safari failed: {e}")
        
    try:
        # Try Chrome
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=chrome_options)
        print("✅ Using Chrome driver")
        return driver
    except Exception as e:
        print(f"❌ Chrome failed: {e}")
        
    print("❌ No browser drivers available")
    return None

def automate_dns_setup():
    """Automate DNS record creation"""
    driver = setup_driver()
    if not driver:
        print("Cannot proceed without browser driver")
        return False
        
    try:
        print("🚀 Starting DNS automation...")
        
        # Navigate to Cloudflare DNS page
        url = "https://dash.cloudflare.com/95630f075913ce585a9271ef6146b2f6/dns/records"
        print(f"📍 Navigating to: {url}")
        driver.get(url)
        
        # Wait for page load
        print("⏳ Waiting for page to load...")
        time.sleep(5)
        
        # Check if already logged in or need to login
        if "login" in driver.current_url.lower():
            print("🔐 Login required - cannot proceed automatically")
            print("Please log into Cloudflare manually, then re-run this script")
            return False
            
        # Look for Add Record button
        print("🔍 Looking for Add Record button...")
        wait = WebDriverWait(driver, 10)
        
        try:
            add_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add record')]")))
            print("✅ Found Add Record button")
            
            # Add root domain record
            print("📝 Adding root domain A record...")
            add_button.click()
            time.sleep(2)
            
            # Fill in the form
            type_field = driver.find_element(By.NAME, "type")
            type_field.clear()
            type_field.send_keys("A")
            
            name_field = driver.find_element(By.NAME, "name") 
            name_field.clear()
            name_field.send_keys("@")
            
            content_field = driver.find_element(By.NAME, "content")
            content_field.clear()
            content_field.send_keys("76.76.21.21")
            
            # Save the record
            save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]")
            save_button.click()
            
            print("✅ Root domain A record added!")
            time.sleep(3)
            
            # Add www record
            print("📝 Adding www A record...")
            add_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Add record')]")
            add_button.click()
            time.sleep(2)
            
            type_field = driver.find_element(By.NAME, "type")
            type_field.clear() 
            type_field.send_keys("A")
            
            name_field = driver.find_element(By.NAME, "name")
            name_field.clear()
            name_field.send_keys("www")
            
            content_field = driver.find_element(By.NAME, "content")
            content_field.clear()
            content_field.send_keys("76.76.21.21")
            
            save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]")
            save_button.click()
            
            print("✅ WWW A record added!")
            print("🎉 DNS configuration complete!")
            
            return True
            
        except Exception as e:
            print(f"❌ Error during automation: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Automation failed: {e}")
        return False
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=== Cloudflare DNS Automation ===")
    success = automate_dns_setup()
    
    if success:
        print("\n✅ DNS records should be created!")
        print("⏳ Wait 5-15 minutes for DNS propagation")
        print("🌐 Your website will be available at:")
        print("   https://axisthorn.com")
        print("   https://www.axisthorn.com")
    else:
        print("\n❌ Automation failed")
        print("📋 Manual steps required:")
        print("1. Go to https://dash.cloudflare.com")
        print("2. Click axisthorn.com → DNS → Records")
        print("3. Add A record: @ → 76.76.21.21")  
        print("4. Add A record: www → 76.76.21.21")