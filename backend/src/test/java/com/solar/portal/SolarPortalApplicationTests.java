package com.solar.portal;

import com.solar.portal.model.MaintenanceRecord;
import com.solar.portal.repository.MaintenanceRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SolarPortalApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MaintenanceRecordRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        repository.save(new MaintenanceRecord("TEST-PLANT-01", "Sector Test", "Panel Inverter Fault", "Test description", "PENDING", "HIGH", "Tester John", 91.5));
    }

    @Test
    void contextLoads() {
        assertNotNull(repository);
    }

    @Test
    void testHealthCheckEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.service", containsString("Solar Plant")));
    }

    @Test
    void testGetAllRecords() throws Exception {
        mockMvc.perform(get("/api/records"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].plantId", is("TEST-PLANT-01")));
    }

    @Test
    void testCreateRecord() throws Exception {
        String newRecordJson = """
            {
                "plantId": "TEST-PLANT-02",
                "location": "Sector West",
                "issueTitle": "Cleaning Required",
                "description": "Heavy dust build-up",
                "status": "PENDING",
                "priority": "LOW",
                "assignedTechnician": "Sarah Connor",
                "efficiencyOutput": 89.0
            }
            """;

        mockMvc.perform(post("/api/records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newRecordJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.plantId", is("TEST-PLANT-02")))
                .andExpect(jsonPath("$.assignedTechnician", is("Sarah Connor")));
    }

    @Test
    void testUpdateStatus() throws Exception {
        MaintenanceRecord saved = repository.findAll().get(0);

        mockMvc.perform(patch("/api/records/" + saved.getId() + "/status")
                .param("status", "IN_PROGRESS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")));
    }
}
