package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupParentRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.ParentHandler{
		Service: &services.ParentServices{
			Repo: &repositories.ParentRepository{
				DB: db,
			},
		},
	}
	api := app.Group("/v1/parent")
	api.Post("/login", handler.AuthLogin)
	api.Post("/register", handler.AddParent)
}
