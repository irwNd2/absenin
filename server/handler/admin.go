package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/services"
)

type AdminHandler struct {
	AdminService    *services.AdminService
	OrgAdminService *services.OrgAdminService
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

	if input.Role != "Admin" && input.Role != "Operator" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request", "error": "Role is wrong"})
	}

	if input.Role == "Admin" {
		res, err := h.AdminService.AdminLogin(&payload)

		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
		}
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": res})
	}

	res, err := h.OrgAdminService.OrgAdminLogin(&payload)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "bad request"})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": res})
}

func (h *AdminHandler) AddAdmin(ctx *fiber.Ctx) error {
	roleParam := ctx.Params("role")

	if roleParam != "admin" && roleParam != "operator" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request", "error": "Role is wrong"})
	}

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

	orgAdmin := new(models.OrgAdmin)

	err := ctx.BodyParser(orgAdmin)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Bad request", "error": err})
	}

	err = h.OrgAdminService.AddOrgAdmin(orgAdmin)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise", "error": err})
	}
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "registered successfully"})
}

func (h *AdminHandler) GetAllOrgAdmin(ctx *fiber.Ctx) error {
	page, err := strconv.Atoi(ctx.Query("page"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(ctx.Query("limit"))
	if err != nil || limit < 1 {
		limit = 10
	}

	admins, err := h.OrgAdminService.GetAllOrgAdmin(page, limit)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ise", "error": err})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success", "data": admins})

}
