package controllers

import (
	"dental-app/config"
	"dental-app/models"

	"github.com/gin-gonic/gin"
)

func CreatePatient(c *gin.Context) {
	var patient models.Patient

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	config.DB.Create(&patient)

	c.JSON(200, patient)
}

func GetPatients(c *gin.Context) {
	var patients []models.Patient
	config.DB.Find(&patients)

	c.JSON(200, patients)
}