package services

import (
	"errors"

	"github.com/irwNd2/absenin/server/dto/mobile"
	"github.com/irwNd2/absenin/server/repositories"
)

type ExpoTokenService struct {
	ParentRepo  *repositories.ParentRepository
	TeacherRepo *repositories.TeacherRepository
	StudentRepo *repositories.StudentRepository
}

func (s *ExpoTokenService) UpdateOrAddExpoToken(p *mobile.UpdateExpoTokenPayload) error {
	var err error
	switch p.UserType {
	case "parent":
		err = s.ParentRepo.UpdateParentToken(p.UserID, p.ExpoToken)
	case "teacher":
		err = s.TeacherRepo.UpdateTeacherToken(p.UserID, p.ExpoToken)
	case "student":
		err = s.StudentRepo.UpdateStudentToken(p.UserID, p.ExpoToken)
	default:
		err = errors.New("invalid user type")
	}
	return err
}
