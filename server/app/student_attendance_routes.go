package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/middlewares"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupStudentAttendanceRoutes(app *fiber.App, db *gorm.DB) {
	h := &handlers.StudentAttendanceHandler{
		Service: &services.StudentAttendanceService{
			Repo: &repositories.StudentAttendanceRepository{
				DB: db,
			},
		},
	}
	app.Use(middlewares.AuthMiddleware(""))
	api := app.Group("/v1/attendance")
	api.Post("/add", h.AddStudentAttendance)
	api.Get("/teacher", h.GetAllByTeacher)
}
