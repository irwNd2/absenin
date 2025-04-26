package handlers

import (
	"net/http"
	"time"

	"github.com/absenin/server-v2/models"
	"github.com/absenin/server-v2/services"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db         *gorm.DB
	jwtService *services.JWTService
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{
		db:         db,
		jwtService: services.NewJWTService(),
	}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		ID             string   `json:"id"`
		Name           string   `json:"name"`
		Email          string   `json:"email"`
		Role           string   `json:"role"`
		PhoneNumber    string   `json:"phone_number"`
		Department     string   `json:"department"`
		EmployeeId     string   `json:"employee_id"`
		Subjects       []string `json:"subjects"`
		OrganizationID string   `json:"organization_id"`
		Organization   struct {
			ID        string `json:"id"`
			Name      string `json:"name"`
			Address   string `json:"address"`
			Email     string `json:"email"`
			CreatedAt string `json:"created_at"`
			UpdatedAt string `json:"updated_at"`
		} `json:"organization"`
	} `json:"user"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var teacher models.Teacher
	if err := h.db.Preload("Organization").Where("email = ?", req.Email).First(&teacher).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare the provided password with the hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(teacher.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token, err := h.jwtService.GenerateToken(&teacher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Create response with all necessary user information
	response := LoginResponse{
		Token: token,
		User: struct {
			ID             string   `json:"id"`
			Name           string   `json:"name"`
			Email          string   `json:"email"`
			Role           string   `json:"role"`
			PhoneNumber    string   `json:"phone_number"`
			Department     string   `json:"department"`
			EmployeeId     string   `json:"employee_id"`
			Subjects       []string `json:"subjects"`
			OrganizationID string   `json:"organization_id"`
			Organization   struct {
				ID        string `json:"id"`
				Name      string `json:"name"`
				Address   string `json:"address"`
				Email     string `json:"email"`
				CreatedAt string `json:"created_at"`
				UpdatedAt string `json:"updated_at"`
			} `json:"organization"`
		}{
			ID:             teacher.ID,
			Name:           teacher.Name,
			Email:          teacher.Email,
			Role:           "teacher",
			PhoneNumber:    teacher.PhoneNumber,
			Department:     teacher.Department,
			EmployeeId:     teacher.EmployeeId,
			Subjects:       teacher.Subjects,
			OrganizationID: teacher.OrganizationID,
			Organization: struct {
				ID        string `json:"id"`
				Name      string `json:"name"`
				Address   string `json:"address"`
				Email     string `json:"email"`
				CreatedAt string `json:"created_at"`
				UpdatedAt string `json:"updated_at"`
			}{
				ID:        teacher.Organization.ID,
				Name:      teacher.Organization.Name,
				Address:   teacher.Organization.Address,
				Email:     teacher.Organization.Email,
				CreatedAt: teacher.Organization.CreatedAt.Format(time.RFC3339),
				UpdatedAt: teacher.Organization.UpdatedAt.Format(time.RFC3339),
			},
		},
	}

	c.JSON(http.StatusOK, response)
}
