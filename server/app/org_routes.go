package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/middlewares"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupOrgRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.OrganizationHandler{
		Service: &services.OrganizationService{
			Repo: &repositories.OrganizationRepository{
				DB: db,
			},
		},
	}

	api := app.Group("/v1/org")
	app.Use(middlewares.AuthMiddleware("Admin"))
	api.Post("/add", handler.AddOrg)
	api.Get("/all", handler.GetAllOrg)
}
