package handlers

import (
	"net/http"

	"github.com/absenin/server-v2/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ClassHandler struct {
	db *gorm.DB
}

func NewClassHandler(db *gorm.DB) *ClassHandler {
	return &ClassHandler{db: db}
}

func (h *ClassHandler) GetClasses(c *gin.Context) {
	var classes []models.Class
	if err := h.db.Find(&classes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch classes"})
		return
	}

	c.JSON(http.StatusOK, classes)
}

func (h *ClassHandler) GetClassStudents(c *gin.Context) {
	classID := c.Param("classId")
	if classID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class name is required"})
		return
	}

	var class models.Class
	if err := h.db.Preload("Students").Where("id = ?", classID).First(&class).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Class not found"})
		return
	}

	c.JSON(http.StatusOK, class.Students)
}
