package services

import (
	"fmt"
	"strconv"

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

func (s *NotificationService) SendNotificationToSingleId(p []*models.StudentAttendanceDetail) error {
	client := expo.NewPushClient(nil)

	for _, payload := range p {
		student, err := s.Repo.GetStudentByByID(payload.StudentID)
		if err != nil {
			fmt.Println("Error fetching student:", err)
			return err
		}

		if student == nil {
			fmt.Println("Student is nil for ID:", payload.StudentID)
			continue
		}

		if student.Parent == nil {
			fmt.Println("Parent is nil for student ID:", payload.StudentID)
			continue
		}

		body := "Anak anda " + *student.Name + " tidak hadir di sekolah hari ini"
		if payload.IsPresent {
			body = "Anak anda " + *student.Name + " hadir di sekolah hari ini"
		}

		notifPayload := mobile.SendNotificationPayload{
			ToExpoToken: "",
			Body:        body,
			Title:       "Kehadiran Siswa",
			UserID:      "parent-" + strconv.Itoa(int(student.ParentID)),
		}

		if student.Parent.ExpoToken == nil {
			fmt.Println("ExpoToken is nil for parent of student ID:", payload.StudentID)
			// Add the notification to the table
			err := s.AddNotification(&notifPayload)
			if err != nil {
				fmt.Println("Error adding notification:", err)
				return err
			}

			// Add the attendance detail
			studentAttDetail := models.StudentAttendanceDetail{
				StudentID:           payload.StudentID,
				StudentAttendanceID: payload.StudentAttendanceID,
				IsPresent:           payload.IsPresent,
				Reason:              payload.Reason,
			}

			err = s.Repo.AddStudentAttendanceDetail(&studentAttDetail)
			if err != nil {
				fmt.Println("Error adding student attendance detail:", err)
				return err
			}

			continue
		}

		pushToken, err := expo.NewExponentPushToken(*student.Parent.ExpoToken)
		if err != nil {
			fmt.Println("Error creating push token:", err)
			continue
		}

		// Send the notification
		response, err := client.Publish(
			&expo.PushMessage{
				To:       []expo.ExponentPushToken{pushToken},
				Body:     body,
				Title:    "Kehadiran Siswa",
				Sound:    "default",
				Priority: expo.DefaultPriority,
			},
		)
		if err != nil {
			fmt.Println("Error publishing push message:", err)
			return err
		}

		err = response.ValidateResponse()
		if err != nil {
			fmt.Println("Error validating push message response:", err)
			return err
		}

		// Add the notification to the table
		notifPayload.ToExpoToken = *student.Parent.ExpoToken
		err = s.AddNotification(&notifPayload)
		if err != nil {
			fmt.Println("Error adding notification:", err)
			return err
		}

		// Add the attendance detail
		studentAttDetail := models.StudentAttendanceDetail{
			StudentID:           payload.StudentID,
			StudentAttendanceID: payload.StudentAttendanceID,
			IsPresent:           payload.IsPresent,
			Reason:              payload.Reason,
		}

		err = s.Repo.AddStudentAttendanceDetail(&studentAttDetail)
		if err != nil {
			fmt.Println("Error adding student attendance detail:", err)
			return err
		}
	}
	return nil
}

func (s *NotificationService) AddNotification(p *mobile.SendNotificationPayload) error {
	notification := models.Notification{
		ExpoToken: p.ToExpoToken,
		Message:   p.Body,
		Title:     p.Title,
		UserID:    p.UserID,
		IsRead:    false,
	}
	return s.Repo.AddNotification(&notification)
}
