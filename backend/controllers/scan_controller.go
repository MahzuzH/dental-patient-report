package controllers

import (
	"database/sql"
	"dental-app/config"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func GetScans(c *gin.Context) {
    type patientSummary struct {
        ID          uint   `json:"id"`
        Name        string `json:"name"`
        Institution string `json:"institution"`
    }

    type scanResponse struct {
        ID          int             `json:"id"`
        PatientID   int             `json:"patient_id"`
        PatientName string          `json:"patient_name"`
        Institution string          `json:"institution"`
        ScanDate    time.Time       `json:"scan_date"`
        Status      string          `json:"status"`
        Patient     *patientSummary `json:"patient"`
    }

    type scanRow struct {
        ID          int            `gorm:"column:id"`
        PatientID   int            `gorm:"column:patient_id"`
        ScanDate    time.Time      `gorm:"column:scan_date"`
        Status      string         `gorm:"column:status"`
        PatientRef  sql.NullInt64  `gorm:"column:patient_ref_id"`
        PatientName sql.NullString `gorm:"column:patient_name"`
        Institution sql.NullString `gorm:"column:institution"`
    }

    var rows []scanRow

    err := config.DB.Table("scans s").
        Select(`
            s.id,
            s.patient_id,
            s.scan_date,
            s.status,
            COALESCE(p.id, pu.id) AS patient_ref_id,
            COALESCE(p.name, pu.name) AS patient_name,
            COALESCE(p.institution, pu.institution) AS institution
        `).
        Joins("LEFT JOIN patients p ON p.id = s.patient_id").
        Joins("LEFT JOIN patients pu ON pu.user_id = s.patient_id").
        Scan(&rows).Error
    if err != nil {
        c.JSON(500, gin.H{"error": "Gagal ambil data"})
        return
    }

    scans := make([]scanResponse, 0, len(rows))
    for _, row := range rows {
        name := row.PatientName.String
        institution := row.Institution.String

        if name == "" {
            name = fmt.Sprintf("Patient #%d", row.PatientID)
        }

        if institution == "" {
            institution = "-"
        }

        item := scanResponse{
            ID:          row.ID,
            PatientID:   row.PatientID,
            PatientName: name,
            Institution: institution,
            ScanDate:    row.ScanDate,
            Status:      row.Status,
        }

        if row.PatientRef.Valid {
            item.Patient = &patientSummary{
                ID:          uint(row.PatientRef.Int64),
                Name:        name,
                Institution: institution,
            }
        }

        scans = append(scans, item)
    }

    c.JSON(200, scans)
}