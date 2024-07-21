package app

import (
	"github.com/gofiber/fiber/v2"
	handlers "github.com/irwNd2/absenin/server/handler"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/services"
	"gorm.io/gorm"
)

func SetupExpoTokenRoutes(app *fiber.App, db *gorm.DB) {
	expoTokenHandler := &handlers.ExpoTokenHandler{
		Service: &services.ExpoTokenService{
			ParentRepo:  &repositories.ParentRepository{DB: db},
			TeacherRepo: &repositories.TeacherRepository{DB: db},
			StudentRepo: &repositories.StudentRepository{DB: db},
		},
	}
	api := app.Group("/v1")
	api.Post("/update-expo-token", expoTokenHandler.UpdateOrAddExpoToken)
}
