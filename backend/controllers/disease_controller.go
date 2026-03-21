package controllers

import (
	"dental-app/config"
	"dental-app/models"

	"github.com/gin-gonic/gin"
)

func GetDiseases(c *gin.Context) {
    var diseases []models.Disease

    result := config.DB.Find(&diseases)
    if result.Error != nil {
        c.JSON(500, gin.H{
            "error": "Failed to fetch diseases",
        })
        return
    }

    c.JSON(200, gin.H{
        "data": diseases,
    })
}