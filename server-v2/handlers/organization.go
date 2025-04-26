package handlers

import (
	"net/http"
	"time"

	"github.com/absenin/server-v2/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func generateID() string {
	return time.Now().Format("20060102150405")
}

type OrganizationHandler struct {
	db *gorm.DB
}

func NewOrganizationHandler(db *gorm.DB) *OrganizationHandler {
	return &OrganizationHandler{db: db}
}

type CreateOrganizationRequest struct {
	Name    string `json:"name" binding:"required"`
	Address string `json:"address" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
}

func (h *OrganizationHandler) CreateOrganization(c *gin.Context) {
	var req CreateOrganizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	organization := models.Organization{
		ID:      "org-" + generateID(),
		Name:    req.Name,
		Address: req.Address,
		Email:   req.Email,
	}

	if err := h.db.Create(&organization).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create organization"})
		return
	}

	c.JSON(http.StatusCreated, organization)
}

func (h *OrganizationHandler) GetOrganizations(c *gin.Context) {
	var organizations []models.Organization
	if err := h.db.Find(&organizations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch organizations"})
		return
	}

	c.JSON(http.StatusOK, organizations)
}

func (h *OrganizationHandler) GetOrganization(c *gin.Context) {
	id := c.Param("id")
	var organization models.Organization
	if err := h.db.First(&organization, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}

	c.JSON(http.StatusOK, organization)
}

type UpdateOrganizationRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Email   string `json:"email" binding:"omitempty,email"`
}

func (h *OrganizationHandler) UpdateOrganization(c *gin.Context) {
	id := c.Param("id")
	var req UpdateOrganizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var organization models.Organization
	if err := h.db.First(&organization, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}

	updates := make(map[string]interface{})
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Address != "" {
		updates["address"] = req.Address
	}
	if req.Email != "" {
		updates["email"] = req.Email
	}

	if err := h.db.Model(&organization).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update organization"})
		return
	}

	c.JSON(http.StatusOK, organization)
}

func (h *OrganizationHandler) DeleteOrganization(c *gin.Context) {
	id := c.Param("id")
	if err := h.db.Delete(&models.Organization{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete organization"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Organization deleted successfully"})
}
