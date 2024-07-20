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

func (r *StudentRepository) UpdateStudentToken(userID uint, token string) error {
	student := &models.Student{}
	err := r.DB.Model(student).Where("id = ?", userID).First(student).Error
	if err != nil {
		return err
	}
	student.ExpoToken = &token
	return r.DB.Save(student).Error
}

func (r *StudentRepository) GetStudentByTeacherId(teacherID uint64) ([]models.Student, error) {
	var students []models.Student
	err := r.DB.Preload("Parent").Where("teacher_id = ?", teacherID).Find(&students).Error
	if err != nil {
		return nil, err
	}
	return students, nil
}
