package models

import "time"

type Patient struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name"`
	Age           int       `json:"age"`
	Gender        string    `json:"gender"`
	Phone         string    `json:"phone"`
	Institution   string    `json:"institution"`
	InstitutionID uint      `json:"institution_id" gorm:"index"`
	StudentID     uint      `json:"student_id" gorm:"index"`
	CreatedAt     time.Time `json:"created_at" gorm:"index"`
}
