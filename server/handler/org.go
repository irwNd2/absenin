package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type OrganizationHandler struct {
	Service *services.OrganizationService
}

func (h *OrganizationHandler) AddOrg(ctx *fiber.Ctx) error {
	org := new(models.Organization)
	err := ctx.BodyParser(org)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Bad request",
			"error":   err.Error(),
		})
	}

	err = h.Service.AddOrg(org)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "registered successfully"})
}

func (h *OrganizationHandler) GetAllOrg(ctx *fiber.Ctx) error {
	page, err := strconv.Atoi(ctx.Query("page"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(ctx.Query("limit"))
	if err != nil || limit < 1 {
		limit = 10
	}

	orgs, err := h.Service.GetAllOrg(page, limit)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": orgs})

}
