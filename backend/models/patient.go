package models

type Patient struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Gender string `json:"gender"`
	Phone  string `json:"phone"`
}