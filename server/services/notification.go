package services

import (
	"github.com/irwNd2/absenin/server/dto/mobile"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
)

type NotificationService struct {
	Repo *repositories.NotificationRepository
}

func (s *NotificationService) GetNotifByToken(p *mobile.TokenPayload) (notif []models.Notification, err error) {
	notif, err = s.Repo.GetNotifByToken(p.ExpoToken)
	return notif, err
}

func (s *NotificationService) SendNotificationToSingleId(p []*mobile.SendNotificationPayload) error {
	client := expo.NewPushClient(nil)

	for _, payload := range p {
		pushToken, err := expo.NewExponentPushToken(payload.ToExpoToken)
		if err != nil {
			err = s.AddNotification(payload)
			if err != nil {
				return err
			}
			continue
		}
		response, err := client.Publish(
			&expo.PushMessage{
				To: []expo.ExponentPushToken{pushToken},
				Body: payload.Body,
				Title: payload.Title,
				Sound: "default",
				Priority: expo.DefaultPriority,
			},
		)
		if err != nil {
			return err
		}

		err = response.ValidateResponse();
		if err != nil {
			return err
		}

		err = s.AddNotification(payload);
		if err != nil {
			return err
		}
		
	}
	return nil
	// ubah logic. req mengirim id dan user type nya. kemudian di cocokkan ke db, apabila ada expo token maka dikirim jika tidak hanya insert notif ke db
	// pushToken, err := expo.NewExponentPushToken(p.ToExpoToken)
	// if err != nil {
	// 	return err
	// }

	// client := expo.NewPushClient(nil)

	// response, err := client.Publish(
	// 	&expo.PushMessage{
	// 		To:       []expo.ExponentPushToken{pushToken},
	// 		Body:     p.Body,
	// 		Title:    p.Title,
	// 		Sound:    "default",
	// 		Priority: expo.DefaultPriority,
	// 	},
	// )

	// if err != nil {
	// 	return err
	// }
	// err = response.ValidateResponse()
	// if err != nil {
	// 	return err
	// }

	// notification := models.Notification{
	// 	ExpoToken: p.ToExpoToken,
	// 	Message:   p.Body,
	// 	Title:     p.Title,
	// 	IsRead:    false,
	// }

	// err = s.Repo.AddNotification(&notification)
	// return err



}

func (s *NotificationService) AddNotification (p *mobile.SendNotificationPayload) error {
	notification := models.Notification{
		ExpoToken: p.ToExpoToken,
		Message: p.Body,
		Title: p.Title,
		UserID: p.UserID,
		IsRead: false,
	}
	return s.Repo.AddNotification(&notification)
}
