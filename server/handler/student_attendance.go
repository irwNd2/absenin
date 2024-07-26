package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/services"
)

type StudentAttendanceHandler struct {
	Service *services.StudentAttendanceService
}

func (h *StudentAttendanceHandler) AddStudentAttendance(ctx *fiber.Ctx) error {
	var attendance web.AddStudentAttendancePayload
	err := ctx.BodyParser(&attendance)
	claims := ctx.Locals("claims").(*web.Claims)
	orgID := claims.OrgID
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
	}
	res, err := h.Service.AddStudentAttendance(&attendance, orgID)
	response := web.AddStudentAttendanceResponse{
		ID: res.ID,
	}
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "success", "data": response})
}

func (h *StudentAttendanceHandler) GetAllByTeacher(ctx *fiber.Ctx) error {
	claims := ctx.Locals("claims").(*web.Claims)
	teacherID := claims.ID
	attendances, err := h.Service.GetAllByTeacher(teacherID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": attendances})

}
