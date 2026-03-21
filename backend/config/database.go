package config

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    dsn := "root:@tcp(127.0.0.1:3306)/dental_app?charset=utf8mb4&parseTime=True&loc=Local"

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Database connection failed ❌")
    }

    sqlDB, err := db.DB()
    if err != nil {
        panic("Failed to get DB instance")
    }

    if err := sqlDB.Ping(); err != nil {
        panic("Database not reachable ❌")
    }

    fmt.Println("\033[32m✅ Database connected successfully \033[0m")

    DB = db
}