package repositories

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type TeacherRepository struct {
	DB *gorm.DB
}

func (r *TeacherRepository) Login(p *web.LoginPayload) (teacher models.Teacher, err error) {
	err = r.DB.Where("email = ?", p.Email).Find(&teacher).Error
	return
}

func (r *TeacherRepository) AddTeacher(teacher *models.Teacher) error {
	return r.DB.Create(teacher).Error
}
