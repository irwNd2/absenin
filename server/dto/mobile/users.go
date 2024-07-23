package mobile

import "time"

type GetStudentByTeacherIDPayload struct {
	TeacherID uint `json:"teacher_id"`
}

type UserDataResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}

type ParentDTO struct {
	UserDataResponse
	ExpoPushToken *string `json:"expo_token"`
}

type StudentDTO struct {
	UserDataResponse
	Parent ParentDTO `json:"parent"`
}
