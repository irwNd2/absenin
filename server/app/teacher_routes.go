package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupTeacherRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.TeacherHandler{
		Service: &services.TeacherService{
			Repo: &repositories.TeacherRepository{
				DB: db,
			},
		},
	}
	api := app.Group("/v1/teacher")
	api.Post("/login", handler.AuthLogin)
	api.Post("/register", handler.AddTeacher)
}
