package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"dental-app/config"
	"dental-app/middleware"
	"dental-app/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Apply middlewares
	r.Use(middleware.LoggingMiddleware())
	r.Use(middleware.CompressionMiddleware())
	r.Use(middleware.RateLimitMiddleware())

	config.ConnectDB()
	routes.SetupRoutes(r)

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API running",
		})
	})

	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// Run server in a goroutine
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	// catching ctx.Done(). timeout of 5 seconds.
	<-ctx.Done()
	log.Println("Server exiting")
}
