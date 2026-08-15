package com.solar.portal.controller;

import com.solar.portal.model.MaintenanceRecord;
import com.solar.portal.repository.MaintenanceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/records")
public class MaintenanceController {

    @Autowired
    private MaintenanceRecordRepository repository;

    @PostConstruct
    public void seedInitialData() {
        if (repository.count() == 0) {
            repository.save(new MaintenanceRecord("SOLAR-PLANT-01", "Sector A - Panel Array 14", "Dust Accumulation & Cleaning Needed", "Solar panel surface dust layer reducing overall output efficiency by 12%.", "PENDING", "MEDIUM", "Alex Rivera", 88.0));
            repository.save(new MaintenanceRecord("SOLAR-PLANT-02", "Sector B - Inverter Station 3", "Inverter Overheating Warning", "High ambient temperature caused Thermal Throttling on Inverter Unit #3.", "IN_PROGRESS", "HIGH", "Kavya Patel", 76.5));
            repository.save(new MaintenanceRecord("SOLAR-PLANT-03", "Sector C - Substation Grid B", "Grid Synchronization Calibration", "Routine 30-day voltage alignment and grid frequency synchronization.", "RESOLVED", "LOW", "Marcus Vance", 99.2));
            repository.save(new MaintenanceRecord("SOLAR-PLANT-04", "Sector D - Tracker Drive 08", "Single-Axis Solar Tracker Motor Fault", "Actuator motor stalled during morning sun tracking sequence.", "IN_PROGRESS", "CRITICAL", "Alex Rivera", 64.0));
        }
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRecord>> getAllRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(repository.findByStatus(status.toUpperCase()));
        }

        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(repository.findByPlantIdContainingIgnoreCaseOrIssueTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(
                    search, search, search));
        }

        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> getRecordById(@PathVariable Long id) {
        Optional<MaintenanceRecord> record = repository.findById(id);
        return record.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecord> createRecord(@RequestBody MaintenanceRecord record) {
        MaintenanceRecord saved = repository.save(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> updateRecord(@PathVariable Long id, @RequestBody MaintenanceRecord updatedRecord) {
        return repository.findById(id).map(record -> {
            record.setPlantId(updatedRecord.getPlantId());
            record.setLocation(updatedRecord.getLocation());
            record.setIssueTitle(updatedRecord.getIssueTitle());
            record.setDescription(updatedRecord.getDescription());
            record.setStatus(updatedRecord.getStatus());
            record.setPriority(updatedRecord.getPriority());
            record.setAssignedTechnician(updatedRecord.getAssignedTechnician());
            if (updatedRecord.getEfficiencyOutput() != null) {
                record.setEfficiencyOutput(updatedRecord.getEfficiencyOutput());
            }
            return ResponseEntity.ok(repository.save(record));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MaintenanceRecord> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repository.findById(id).map(record -> {
            record.setStatus(status.toUpperCase());
            return ResponseEntity.ok(repository.save(record));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
