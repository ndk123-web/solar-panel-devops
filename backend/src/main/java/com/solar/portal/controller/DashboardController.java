package com.solar.portal.controller;

import com.solar.portal.model.MaintenanceRecord;
import com.solar.portal.repository.MaintenanceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private MaintenanceRecordRepository repository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<MaintenanceRecord> allRecords = repository.findAll();

        long totalCount = allRecords.size();
        long pendingCount = repository.countByStatus("PENDING");
        long inProgressCount = repository.countByStatus("IN_PROGRESS");
        long resolvedCount = repository.countByStatus("RESOLVED");

        double avgEfficiency = allRecords.stream()
                .filter(r -> r.getEfficiencyOutput() != null)
                .mapToDouble(MaintenanceRecord::getEfficiencyOutput)
                .average()
                .orElse(92.5);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRecords", totalCount);
        stats.put("pendingRecords", pendingCount);
        stats.put("inProgressRecords", inProgressCount);
        stats.put("resolvedRecords", resolvedCount);
        stats.put("activeAlerts", pendingCount + inProgressCount);
        stats.put("avgEfficiencyPercent", Math.round(avgEfficiency * 10.0) / 10.0);
        stats.put("totalInstalledCapacityMW", 450.0);
        stats.put("currentPowerOutputMW", Math.round((450.0 * (avgEfficiency / 100.0)) * 10.0) / 10.0);

        return ResponseEntity.ok(stats);
    }
}
