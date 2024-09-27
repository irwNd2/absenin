package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/middlewares"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupStudentClassRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.StudentClassHandler{
		Service: &services.StudentClassService{
			Repo: &repositories.StudentClassRepository{
				DB: db,
			},
		},
	}
	app.Use(middlewares.AuthMiddleware(""))
	api := app.Group("/v1/class")
	api.Get("/all", handler.GetAllClasses)
}
