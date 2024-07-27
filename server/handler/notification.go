package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/mobile"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type NotificationHandler struct {
	Service *services.NotificationService
}

func (h *NotificationHandler) GetNotifByToken(ctx *fiber.Ctx) error {
	var input mobile.TokenPayload
	notifs, err := h.Service.GetNotifByToken(&input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": notifs})
}

func (h *NotificationHandler) SendNotification(ctx *fiber.Ctx) error {
	var inputs []*models.StudentAttendanceDetail
	err := ctx.BodyParser(&inputs)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
	}
	err = h.Service.SendNotificationToSingleId(inputs)
	if err != nil {
		fmt.Println(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success"})
}
