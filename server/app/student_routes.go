package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupStudentRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.StudentHandler{
		Service: &services.StudentService{
			Repo: &repositories.StudentRepository{
				DB: db,
			},
		},
	}
	api := app.Group("/v1/student")
	api.Post("/login", handler.AuthLogin)
	api.Post("/register", handler.AddStudent)
}
