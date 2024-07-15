package services

import (
	"github.com/irwNd2/absenin/server/dto/mobile"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
)

type NotificationService struct {
	Repo *repositories.NotificationRepository
}

func (s *NotificationService) GetNotifByToken(p *mobile.TokenPayload) (notif []models.Notification, err error) {
	notif, err = s.Repo.GetNotifByToken(p.ExpoToken)
	return notif, err
}

// func (s *NotificationService) SendNotificationToSingleId(p *mobile.SendNotificationPayload) error {
// hit expo api
//example
// curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
// 	"to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
// 	"title":"hello",
// 	"body": "world"
//   }'

// }
