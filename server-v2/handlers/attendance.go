package handlers

import (
	"net/http"
	"time"

	"github.com/absenin/server-v2/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AttendanceHandler struct {
	db *gorm.DB
}

func NewAttendanceHandler(db *gorm.DB) *AttendanceHandler {
	return &AttendanceHandler{db: db}
}

type CreateAttendanceRequest struct {
	TeacherID string `json:"teacherId" binding:"required"`
	Subject   string `json:"subject" binding:"required"`
	ClassName string `json:"className" binding:"required"`
	Date      string `json:"date" binding:"required"`
	Students  []struct {
		StudentID string `json:"studentId" binding:"required"`
		Status    string `json:"status" binding:"required,oneof=present sick absent"`
	} `json:"students" binding:"required"`
}

func (h *AttendanceHandler) CreateAttendance(c *gin.Context) {
	var req CreateAttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	date, err := time.Parse("2006-01-02T15:04", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Expected format: YYYY-MM-DDTHH:mm"})
		return
	}

	// Generate unique ID for attendance
	attendanceID := "A" + time.Now().Format("20060102150405")

	attendance := models.Attendance{
		ID:        attendanceID,
		TeacherID: req.TeacherID,
		Subject:   req.Subject,
		ClassName: req.ClassName,
		Date:      date,
	}

	// Create attendance record
	if err := h.db.Create(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create attendance"})
		return
	}

	// Create student attendance records
	for _, student := range req.Students {
		// Generate unique ID for each student attendance record
		studentAttendanceID := attendanceID + "-" + student.StudentID

		studentAttendance := models.StudentAttendance{
			ID:           studentAttendanceID,
			AttendanceID: attendanceID,
			StudentID:    student.StudentID,
			Status:       student.Status,
		}
		if err := h.db.Create(&studentAttendance).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create student attendance"})
			return
		}
	}

	c.JSON(http.StatusCreated, attendance)
}

func (h *AttendanceHandler) GetAttendance(c *gin.Context) {
	var attendances []models.Attendance
	if err := h.db.Preload("Students").Find(&attendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance records"})
		return
	}

	c.JSON(http.StatusOK, attendances)
}

func (h *AttendanceHandler) GetAttendanceByTeacher(c *gin.Context) {
	teacherID := c.Param("teacherId")
	if teacherID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Teacher ID is required"})
		return
	}

	var attendances []models.Attendance
	if err := h.db.Preload("Students").Where("teacher_id = ?", teacherID).Find(&attendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance records"})
		return
	}

	// Transform the response to use camelCase
	var response []struct {
		ID        string `json:"id"`
		TeacherID string `json:"teacherId"`
		Subject   string `json:"subject"`
		ClassName string `json:"className"`
		Date      string `json:"date"`
		Students  []struct {
			ID     string `json:"id"`
			Name   string `json:"name"`
			Status string `json:"status"`
		} `json:"students"`
		CreatedAt string `json:"createdAt"`
		UpdatedAt string `json:"updatedAt"`
	}

	for _, attendance := range attendances {
		// Get student names
		var studentAttendances []struct {
			models.StudentAttendance
			StudentName string `gorm:"column:name"`
		}

		if err := h.db.Table("student_attendances").
			Select("student_attendances.*, students.name").
			Joins("LEFT JOIN students ON student_attendances.student_id = students.id").
			Where("student_attendances.attendance_id = ?", attendance.ID).
			Scan(&studentAttendances).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch student details"})
			return
		}

		var students []struct {
			ID     string `json:"id"`
			Name   string `json:"name"`
			Status string `json:"status"`
		}

		for _, sa := range studentAttendances {
			students = append(students, struct {
				ID     string `json:"id"`
				Name   string `json:"name"`
				Status string `json:"status"`
			}{
				ID:     sa.StudentID,
				Name:   sa.StudentName,
				Status: sa.Status,
			})
		}

		response = append(response, struct {
			ID        string `json:"id"`
			TeacherID string `json:"teacherId"`
			Subject   string `json:"subject"`
			ClassName string `json:"className"`
			Date      string `json:"date"`
			Students  []struct {
				ID     string `json:"id"`
				Name   string `json:"name"`
				Status string `json:"status"`
			} `json:"students"`
			CreatedAt string `json:"createdAt"`
			UpdatedAt string `json:"updatedAt"`
		}{
			ID:        attendance.ID,
			TeacherID: attendance.TeacherID,
			Subject:   attendance.Subject,
			ClassName: attendance.ClassName,
			Date:      attendance.Date.Format(time.RFC3339),
			Students:  students,
			CreatedAt: attendance.CreatedAt.Format(time.RFC3339),
			UpdatedAt: attendance.UpdatedAt.Format(time.RFC3339),
		})
	}

	c.JSON(http.StatusOK, response)
}

func (h *AttendanceHandler) GetAttendanceByClass(c *gin.Context) {
	className := c.Param("className")
	if className == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class name is required"})
		return
	}

	var attendances []models.Attendance
	if err := h.db.Preload("Students").Where("class_name = ?", className).Find(&attendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance records"})
		return
	}

	c.JSON(http.StatusOK, attendances)
}

func (h *AttendanceHandler) UpdateAttendance(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Attendance ID is required"})
		return
	}

	var req struct {
		Students []struct {
			StudentID string `json:"studentId" binding:"required"`
			Status    string `json:"status" binding:"required,oneof=present sick absent"`
		} `json:"students" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update student attendance records
	for _, student := range req.Students {
		var studentAttendance models.StudentAttendance
		if err := h.db.Where("attendance_id = ? AND student_id = ?", id, student.StudentID).First(&studentAttendance).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Student attendance record not found"})
			return
		}

		studentAttendance.Status = student.Status
		if err := h.db.Save(&studentAttendance).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update student attendance"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attendance updated successfully"})
}

func (h *AttendanceHandler) DeleteAttendance(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Attendance ID is required"})
		return
	}

	// Delete student attendance records first
	if err := h.db.Where("attendance_id = ?", id).Delete(&models.StudentAttendance{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete student attendance records"})
		return
	}

	// Delete attendance record
	if err := h.db.Delete(&models.Attendance{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete attendance record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attendance deleted successfully"})
}

func (h *AttendanceHandler) GetAttendanceByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Attendance ID is required"})
		return
	}

	var attendance models.Attendance
	if err := h.db.Preload("Students").First(&attendance, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attendance not found"})
		return
	}

	// Get student names
	var studentAttendances []struct {
		models.StudentAttendance
		StudentName string `gorm:"column:name"`
	}

	if err := h.db.Table("student_attendances").
		Select("student_attendances.*, students.name").
		Joins("LEFT JOIN students ON student_attendances.student_id = students.id").
		Where("student_attendances.attendance_id = ?", id).
		Scan(&studentAttendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch student details"})
		return
	}

	// Map the results to include student names
	var students []struct {
		ID     string `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}

	for _, sa := range studentAttendances {
		students = append(students, struct {
			ID     string `json:"id"`
			Name   string `json:"name"`
			Status string `json:"status"`
		}{
			ID:     sa.StudentID,
			Name:   sa.StudentName,
			Status: sa.Status,
		})
	}

	response := struct {
		ID        string `json:"id"`
		TeacherID string `json:"teacherId"`
		Subject   string `json:"subject"`
		ClassName string `json:"className"`
		Date      string `json:"date"`
		Students  []struct {
			ID     string `json:"id"`
			Name   string `json:"name"`
			Status string `json:"status"`
		} `json:"students"`
		CreatedAt string `json:"createdAt"`
		UpdatedAt string `json:"updatedAt"`
	}{
		ID:        attendance.ID,
		TeacherID: attendance.TeacherID,
		Subject:   attendance.Subject,
		ClassName: attendance.ClassName,
		Date:      attendance.Date.Format(time.RFC3339),
		Students:  students,
		CreatedAt: attendance.CreatedAt.Format(time.RFC3339),
		UpdatedAt: attendance.UpdatedAt.Format(time.RFC3339),
	}

	c.JSON(http.StatusOK, response)
}
