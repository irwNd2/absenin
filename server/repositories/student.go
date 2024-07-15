package repositories

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type StudentRepository struct {
	DB *gorm.DB
}

func (r *StudentRepository) Login(p *web.LoginPayload) (student models.Student, err error) {
	err = r.DB.Where("email = ?", p.Email).Find(&student).Error
	return
}

func (r *StudentRepository) AddStudent(student *models.Student) error {
	return r.DB.Create(student).Error
}
