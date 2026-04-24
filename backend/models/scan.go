package models

import "time"

type Scan struct {
	ID        int       `json:"id"`
	PatientID int       `json:"patient_id" gorm:"index"`
	Patient   Patient   `gorm:"foreignKey:PatientID" json:"patient"` // ✅ INI FIX
	ScanDate  time.Time `json:"scan_date"`
	Status    string    `json:"status" gorm:"index"`
	CreatedAt time.Time `json:"created_at" gorm:"index"`
}
