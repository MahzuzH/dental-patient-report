package middleware

import (
	"log/slog"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

var logger *slog.Logger

func init() {
	// Initialize structured logger
	logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
}

// LoggingMiddleware logs request duration and other structured details
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		duration := time.Since(start)
		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path
		clientIP := c.ClientIP()

		// Log structured data
		logger.Info("Request processed",
			slog.String("method", method),
			slog.String("path", path),
			slog.Int("status", status),
			slog.String("duration", duration.String()),
			slog.String("client_ip", clientIP),
		)
	}
}
