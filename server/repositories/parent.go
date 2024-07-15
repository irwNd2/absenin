package repositories

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type ParentRepository struct {
	DB *gorm.DB
}

func (r *ParentRepository) Login(p *web.LoginPayload) (parent models.Parent, err error) {
	err = r.DB.Where("email = ?", p.Email).Find(&parent).Error
	return
}

func (r *ParentRepository) AddParent(parent *models.Parent) error {
	return r.DB.Create(parent).Error
}

func (r *ParentRepository) UpdateParentToken(userID uint, token string) error {
	parent := &models.Parent{}
	err := r.DB.Model(parent).Where("id = ?", userID).First(parent).Error
	if err != nil {
		return err
	}
	parent.ExpoToken = &token
	return r.DB.Save(parent).Error
}
