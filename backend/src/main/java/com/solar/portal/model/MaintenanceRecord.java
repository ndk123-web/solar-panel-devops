package com.solar.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String plantId;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String issueTitle;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, RESOLVED

    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    private String assignedTechnician;

    private Double efficiencyOutput; // Percentage e.g. 88.5

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MaintenanceRecord() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
        this.priority = "MEDIUM";
    }

    public MaintenanceRecord(String plantId, String location, String issueTitle, String description, String status, String priority, String assignedTechnician, Double efficiencyOutput) {
        this.plantId = plantId;
        this.location = location;
        this.issueTitle = issueTitle;
        this.description = description;
        this.status = status != null ? status : "PENDING";
        this.priority = priority != null ? priority : "MEDIUM";
        this.assignedTechnician = assignedTechnician;
        this.efficiencyOutput = efficiencyOutput != null ? efficiencyOutput : 95.0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlantId() {
        return plantId;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getIssueTitle() {
        return issueTitle;
    }

    public void setIssueTitle(String issueTitle) {
        this.issueTitle = issueTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(String assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }

    public Double getEfficiencyOutput() {
        return efficiencyOutput;
    }

    public void setEfficiencyOutput(Double efficiencyOutput) {
        this.efficiencyOutput = efficiencyOutput;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
