package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
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

func (h *SubjectHandler) GetTeacherSubject(ctx *fiber.Ctx) error {
	claims := ctx.Locals("claims").(*web.Claims)
	orgID := claims.OrgID
	teacherID := claims.ID

	subjects, err := h.Service.GetTeacherSubject(orgID, teacherID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": subjects})
	
}
