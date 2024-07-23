package repositories

import (
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type StudentClassRepository struct {
	DB *gorm.DB
}

func (r *StudentClassRepository) GetAllClasses(orgID uint) ([]models.StudentClass, error) {
	var classes []models.StudentClass
	err := r.DB.Where("organization_id = ?", orgID).Find(&classes).Error
	if err != nil {
		return nil, err
	}
	return classes, nil
}