package repositories

import (
	"github.com/irwNd2/absenin/server/models"
	"gorm.io/gorm"
)

type NotificationRepository struct {
	DB *gorm.DB
}

func (r *NotificationRepository) GetNotifByToken(token string) ([]models.Notification, error) {
	var notif []models.Notification
	err := r.DB.Where("expo_token", token).Find(&notif).Error
	return notif, err
}

func (r *NotificationRepository) AddNotification(notif *models.Notification) error {
	return r.DB.Create(&notif).Error
}

func (r *NotificationRepository) GetStudentByByID(studentID uint) (*models.Student, error) {
	var student models.Student
	err := r.DB.Preload("Parent").Where("id = ?", studentID).Find(&student).Error

	if err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *NotificationRepository) AddStudentAttendanceDetail(att *models.StudentAttendanceDetail) error {
	return r.DB.Create(&att).Error
}
