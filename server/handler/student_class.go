package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/services"
)

type StudentClassHandler struct {
	Service *services.StudentClassService
}

func (h *StudentClassHandler) GetAllClasses(ctx *fiber.Ctx) error {
	claims := ctx.Locals("claims").(*web.Claims)
	orgID := claims.OrgID

	classes, err := h.Service.GetAllClasses(orgID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": classes})

}
