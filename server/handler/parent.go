package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type ParentHandler struct {
	Service *services.ParentServices
}

func (h *ParentHandler) AuthLogin(ctx *fiber.Ctx) error {
	var input web.LoginPayload
	err := ctx.BodyParser(&input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	res, err := h.Service.Login(&input)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": res})
}

func (h *ParentHandler) AddParent(ctx *fiber.Ctx) error {
	parent := new(models.Parent)
	err := ctx.BodyParser(parent)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request"})
	}

	err = h.Service.AddParent(parent)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "registered successfully"})
}
