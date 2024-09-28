package repositories

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type OrgAdminRepository struct {
	DB *gorm.DB
}

func (r *OrgAdminRepository) AddOrgAdmin(orgAdmin *models.OrgAdmin) error {
	return r.DB.Create(orgAdmin).Error
}

func (r *OrgAdminRepository) OrgAdminLogin(p *web.LoginPayload) (orgAdmin models.OrgAdmin, err error) {
	err = r.DB.Where("email = ?", p.Email).Find(&orgAdmin).Error
	return
}

func (r *OrgAdminRepository) GetAll(limit, offset int) ([]models.OrgAdmin, error) {
	var orgAdmin []models.OrgAdmin
	err := r.DB.Preload("Organization").Limit(limit).Offset(offset).Find(&orgAdmin).Error

	if err != nil {
		return nil, err
	}
	return orgAdmin, nil
}
