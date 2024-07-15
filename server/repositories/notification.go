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
