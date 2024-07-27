package repositories

import (
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type StudentAttendanceRepository struct {
	DB *gorm.DB
}

func (r *StudentAttendanceRepository) AddStudentAttendance(attendance *models.StudentAttendance) (*models.StudentAttendance, error) {
	err := r.DB.Create(attendance).Error
	if err != nil {
		return nil, err
	}
	return attendance, nil
}

func (r *StudentAttendanceRepository) GetAllByTeacher(teacherID uint) ([]models.StudentAttendance, error) {
	var attendances []models.StudentAttendance
	err := r.DB.Where("teacher_id = ?", teacherID).Preload("StudentClass").Preload("StudentAttendanceDetail").Preload("Subject").Order("created_at desc").Find(&attendances).Error
	if err != nil {
		return nil, err
	}
	return attendances, nil
}
