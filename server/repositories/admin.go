package repositories

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type AdminRepository struct {
	DB *gorm.DB
}

func (r *AdminRepository) AdminLogin(p *web.LoginPayload) (admin models.Admin, err error) {
	err = r.DB.Where("email = ?", p.Email).Find(&admin).Error
	return
}

func (r *AdminRepository) AddAdmin(admin *models.Admin) error {
	return r.DB.Create(admin).Error
}