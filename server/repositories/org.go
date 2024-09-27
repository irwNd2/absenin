package repositories

import (
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type OrganizationRepository struct {
	DB *gorm.DB
}

func (r *OrganizationRepository) AddOrg(org *models.Organization) error {
	return r.DB.Create(org).Error
}

func (r *OrganizationRepository) GetAllOrg(limit, offset int) ([]models.Organization, error) {
	var orgs []models.Organization
	err := r.DB.Limit(limit).Offset(offset).Find(&orgs).Error

	if err != nil {
		return nil, err
	}
	return orgs, nil
}
