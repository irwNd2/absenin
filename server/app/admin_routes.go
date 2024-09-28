package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/middlewares"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupAdminRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.AdminHandler{
		AdminService: &services.AdminService{
			Repo: &repositories.AdminRepository{
				DB: db,
			},
		},
		OrgAdminService: &services.OrgAdminService{
			Repo: &repositories.OrgAdminRepository{
				DB: db,
			},
		},
	}

	api := app.Group("/v1/admin")
	api.Post("/login", handler.AdminLogin)
	app.Use(middlewares.AuthMiddleware("Admin"))
	api.Post("/add/:role", handler.AddAdmin)
	api.Get("/operator", handler.GetAllOrgAdmin)
}
