package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupNotificationRoutes(app *fiber.App, db *gorm.DB) {
	handler := &handlers.NotificationHandler{
		Service: &services.NotificationService{
			Repo: &repositories.NotificationRepository{
				DB: db,
			},
		},
	}
	api := app.Group("/v1/notif")
	api.Get("/getAll", handler.GetNotifByToken) // ubah ke get notif by user id
	api.Post("/send-notification", handler.SendNotification)
}
