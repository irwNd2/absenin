package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type AdminHandler struct {
	AdminService *services.AdminService
}

func (h *AdminHandler) AdminLogin(ctx *fiber.Ctx) error {
	var input web.AdminLoginPayload
	err := ctx.BodyParser(&input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
	}

	payload := web.LoginPayload{
		Email:    input.Email,
		Password: input.Password,
	}

	if input.Role == "Admin" {
		res, err := h.AdminService.AdminLogin(&payload)

		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
		}
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": res})
	}
	return nil
}

func (h *AdminHandler) AddAdmin(ctx *fiber.Ctx) error {
	roleParam := ctx.Params("role")

	if roleParam == "admin" {
		admin := new(models.Admin)

		err := ctx.BodyParser(admin)
		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request"})
		}

		err = h.AdminService.AddAdmin(admin)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise"})
		}
		return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "registered successfully"})
	}
	return nil
}
