package main

import (
	"log"
	"os"

	"github.com/absenin/server-v2/models"
	"github.com/absenin/server-v2/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database connection
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate models
	if err := db.AutoMigrate(&models.Teacher{}, &models.Class{}, &models.Student{}, &models.Attendance{}, &models.StudentAttendance{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Initialize router
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r, db)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
