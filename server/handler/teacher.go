package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type TeacherHandler struct {
	Service *services.TeacherService
}

func (h *TeacherHandler) AuthLogin(ctx *fiber.Ctx) error {
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

func (h *TeacherHandler) AddTeacher(ctx *fiber.Ctx) error {
	teacher := new(models.Teacher)
	err := ctx.BodyParser(teacher)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request"})
	}

	err = h.Service.AddTeacher(teacher)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "registered successfully"})
}
