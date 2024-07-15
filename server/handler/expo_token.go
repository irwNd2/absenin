package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/mobile"
	"github.com/irwNd2/absenin/server/services"
)

type ExpoTokenHandler struct {
	Service *services.ExpoTokenService
}

func (h *ExpoTokenHandler) UpdateOrAddExpoToken(ctx *fiber.Ctx) error {
	var input mobile.UpdateExpoTokenPayload

	err := ctx.BodyParser(&input)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad request"})
	}

	err = h.Service.UpdateOrAddExpoToken(&input)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Expo token updated/added successfully"})
}
