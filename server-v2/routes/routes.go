package routes

import (
	"github.com/absenin/server-v2/handlers"
	"github.com/absenin/server-v2/middleware"
	"github.com/absenin/server-v2/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	jwtService := services.NewJWTService()
	authMiddleware := middleware.AuthMiddleware(jwtService)

	authHandler := handlers.NewAuthHandler(db)
	teacherHandler := handlers.NewTeacherHandler(db)
	attendanceHandler := handlers.NewAttendanceHandler(db)
	organizationHandler := handlers.NewOrganizationHandler(db)
	classHandler := handlers.NewClassHandler(db)

	// Auth routes
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/register", teacherHandler.CreateTeacher)
	}

	// Protected routes
	protected := r.Group("/api")
	protected.Use(authMiddleware)
	{
		// Class routes
		class := protected.Group("/classes")
		{
			class.GET("", classHandler.GetClasses)
			class.GET("/:className/students", classHandler.GetClassStudents)
		}

		// Attendance routes
		attendance := protected.Group("/attendance")
		{
			attendance.POST("", attendanceHandler.CreateAttendance)
			attendance.GET("", attendanceHandler.GetAttendance)
			attendance.GET("/teacher/:teacherId", attendanceHandler.GetAttendanceByTeacher)
			attendance.GET("/class/:className", attendanceHandler.GetAttendanceByClass)
			attendance.PUT("/:id", attendanceHandler.UpdateAttendance)
			attendance.DELETE("/:id", attendanceHandler.DeleteAttendance)
			attendance.GET("/:id", attendanceHandler.GetAttendanceByID)
		}

		// Organization routes
		organization := protected.Group("/organizations")
		{
			organization.POST("", organizationHandler.CreateOrganization)
			organization.GET("", organizationHandler.GetOrganizations)
			organization.GET("/:id", organizationHandler.GetOrganization)
			organization.PUT("/:id", organizationHandler.UpdateOrganization)
			organization.DELETE("/:id", organizationHandler.DeleteOrganization)
		}
	}
}
