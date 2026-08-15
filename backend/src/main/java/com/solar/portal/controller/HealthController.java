package com.solar.portal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Solar Plant Maintenance Portal");
        status.put("timestamp", LocalDateTime.now());
        status.put("database", "SQLite Connected");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getApplicationInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("appName", "Solar Plant Maintenance Portal");
        info.put("version", "1.0.0-SNAPSHOT");
        info.put("author", "NAVNATH KADAM");
        info.put("buildTool", "Apache Maven");
        info.put("deploymentTarget", "Tomcat / Nginx Server");
        return ResponseEntity.ok(info);
    }
}
