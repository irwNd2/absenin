package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/services"
)

type SubjectHandler struct {
	Service *services.SubjectService
}

func (h *SubjectHandler) GetAllSubjectByOrgID(ctx *fiber.Ctx) error {
	orgIDParam := ctx.Params("orgID")
	orgID, err := strconv.Atoi(orgIDParam)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "org id format is not acceptable"})
	}

	subjects, err := h.Service.GetAllSubjectByOrgID(uint(orgID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": subjects})
}
