package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2/middleware/cors"
	apps "github.com/irwNd2/absenin/server/app"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	config := &apps.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		DBname:   os.Getenv("DB_DBNAME"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
	}

	db, err := apps.NewConnection(config)
	if err != nil {
		log.Fatal("Database connection error")
	}
	err = apps.Migrate(db)

	if err != nil {
		log.Fatal("Database migrating error")
	}
	app := fiber.New()
	app.Use(cors.New())

	apps.SetupParentRoutes(app, db)
	apps.SetupStudentRoutes(app, db)
	apps.SetupTeacherRoutes(app, db)
	apps.SetupExpoTokenRoutes(app, db)
	apps.SetupNotificationRoutes(app, db)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	app.Listen("0.0.0.0:" + port)
}
