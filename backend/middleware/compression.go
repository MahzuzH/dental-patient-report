package middleware

import (
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

// CompressionMiddleware adds gzip compression to responses
func CompressionMiddleware() gin.HandlerFunc {
	// Using default compression level
	return gzip.Gzip(gzip.DefaultCompression)
}
