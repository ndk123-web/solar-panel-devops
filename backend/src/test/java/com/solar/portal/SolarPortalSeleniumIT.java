package com.solar.portal;

import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.assertTrue;

class SolarPortalSeleniumIT {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    void openDashboard() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1200");
        driver = new org.openqa.selenium.chrome.ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        driver.get("http://localhost:3000");
    }

    @AfterEach
    void closeBrowser() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    void dashboardLoadsWithBackendStatusAndMaintenanceRecords() {
        wait.until(ExpectedConditions.titleContains("Solar"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(normalize-space(), 'Solar Plant Maintenance Portal')]")));

        String pageText = driver.findElement(By.tagName("body")).getText();
        assertTrue(pageText.contains("Maintenance"));
        assertTrue(pageText.contains("Backend (Spring Boot): ONLINE"));
        assertTrue(pageText.contains("SOLAR-PLANT-01"));
    }

    @Test
    void maintenanceSearchFiltersVisibleRecords() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[placeholder='Search Plant ID, Location, Issue...']")));

        var search = driver.findElement(
                By.cssSelector("input[placeholder='Search Plant ID, Location, Issue...']"));
        search.sendKeys("SOLAR-PLANT-02");

        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//tr[.//*[normalize-space()='SOLAR-PLANT-01']]")));
        String pageText = driver.findElement(By.tagName("body")).getText();
        assertTrue(pageText.contains("SOLAR-PLANT-02"));
        assertTrue(!pageText.contains("SOLAR-PLANT-01"));
    }
}
