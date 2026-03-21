package controllers

import (
	"dental-app/config"
	"dental-app/models"
	"dental-app/utils"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var input models.User
	var user models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	config.DB.Where("email = ?", input.Email).First(&user)

	if user.ID == 0 {
		c.JSON(401, gin.H{"error": "User not found"})
		return
	}

	if !utils.CheckPassword(user.Password, input.Password) {
		c.JSON(401, gin.H{"error": "Wrong password"})
		return
	}

	token, _ := utils.GenerateToken(user.ID, user.Role)

	c.JSON(200, gin.H{
		"token": token,
	})
}