package handlers

import (
	"net/http"
	"time"

	"github.com/absenin/server-v2/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TeacherHandler struct {
	db *gorm.DB
}

func NewTeacherHandler(db *gorm.DB) *TeacherHandler {
	return &TeacherHandler{db: db}
}

type CreateTeacherRequest struct {
	Name           string   `json:"name" binding:"required"`
	Email          string   `json:"email" binding:"required,email"`
	Password       string   `json:"password" binding:"required,min=6"`
	PhoneNumber    string   `json:"phone_number" binding:"required"`
	Subjects       []string `json:"subjects" binding:"required"`
	OrganizationID string   `json:"organization_id" binding:"required"`
}

func (h *TeacherHandler) CreateTeacher(c *gin.Context) {
	var req CreateTeacherRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if organization exists
	var organization models.Organization
	if err := h.db.First(&organization, "id = ?", req.OrganizationID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Organization not found"})
		return
	}

	// Check if email already exists
	var existingTeacher models.Teacher
	if err := h.db.Where("email = ?", req.Email).First(&existingTeacher).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	// Create new teacher
	teacher := models.Teacher{
		ID:             "T" + time.Now().Format("20060102150405"),
		Name:           req.Name,
		Email:          req.Email,
		PhoneNumber:    req.PhoneNumber,
		Subjects:       req.Subjects,
		OrganizationID: req.OrganizationID,
	}

	// Hash the password
	if err := teacher.HashPassword(req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Save to database
	if err := h.db.Create(&teacher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create teacher"})
		return
	}

	// Don't return the hashed password
	teacher.Password = ""
	c.JSON(http.StatusCreated, teacher)
}
