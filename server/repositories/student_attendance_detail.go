package repositories

import (
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type StudentAttendanceDetailRepository struct {
	DB *gorm.DB
}

func (r *StudentAttendanceDetailRepository) AddStudentAttendanceDetail(att *models.StudentAttendanceDetail) error {
	return r.DB.Create(&att).Error
}
