package middlewares

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/irwNd2/absenin/server/utils"
)

func AuthMiddleware(requiredRole string) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		authHeader := ctx.Get("Authorization")
		if authHeader == "" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header missing",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format",
			})
		}

		token := parts[1]
		claims := utils.ParseAccessToken(token)
		if claims == nil {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		if claims.Role == "Admin" {
			ctx.Locals("claims", claims)
			return ctx.Next()
		}

		if requiredRole != "" && claims.Role != requiredRole {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "You do not have the required role",
			})
		}

		ctx.Locals("claims", claims)
		return ctx.Next()
	}
}
