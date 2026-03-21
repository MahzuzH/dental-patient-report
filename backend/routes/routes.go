package routes

import (
	"dental-app/controllers"
	"dental-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

api := r.Group("/api")
{
	api.POST("/login", controllers.Login)

	// public
	api.GET("/diseases", controllers.GetDiseases)

	// protected
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/patients", controllers.CreatePatient)
		protected.GET("/patients", controllers.GetPatients)
	}
}
}