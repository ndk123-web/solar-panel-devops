package com.solar.portal.repository;

import com.solar.portal.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    
    List<MaintenanceRecord> findByStatus(String status);
    
    List<MaintenanceRecord> findByPlantIdContainingIgnoreCaseOrIssueTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String plantId, String issueTitle, String location);

    long countByStatus(String status);
}
