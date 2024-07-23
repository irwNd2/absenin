package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/middlewares"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupSubjectRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.SubjectHandler{
		Service: &services.SubjectService{
			Repo: &repositories.SubjectRepository{
				DB: db,
			},
		},
	}
	app.Use(middlewares.AuthMiddleware)
	api := app.Group("/v1/subject")
	api.Get("/all/:orgID", handler.GetAllSubjectByOrgID)
}
