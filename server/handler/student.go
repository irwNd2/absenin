package handlers

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type StudentHandler struct {
	Service *services.StudentService
}

func (h *StudentHandler) AuthLogin(ctx *fiber.Ctx) error {
	var input web.LoginPayload
	err := ctx.BodyParser(&input)
	if err != nil {
		fmt.Println(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	res, err := h.Service.Login(&input)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": res})
}

func (h *StudentHandler) AddStudent(ctx *fiber.Ctx) error {
	student := new(models.Student)
	err := ctx.BodyParser(student)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request"})
	}

	err = h.Service.AddStudent(student)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "registered successfully"})
}

func (h *StudentHandler) GetStudentByTeacherId(ctx *fiber.Ctx) error {
	teacherIDParam := ctx.Params("teacherID")
	teacherID, err := strconv.ParseUint(teacherIDParam, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
	}

	students, err := h.Service.GetStudentByTeacherId(teacherID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": students})
}
