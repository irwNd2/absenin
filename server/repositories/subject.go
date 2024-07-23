package repositories

import (
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type SubjectRepository struct {
	DB *gorm.DB
}

func (r *SubjectRepository) GetAllSubjectByOrgID(orgID uint) ([]models.Subject, error) {
	var subjects []models.Subject
	err := r.DB.Where("organization_id = ?", orgID).Find(&subjects).Error
	if err != nil {
		return nil, err
	}
	return subjects, nil
}
