package services

import (
	"errors"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/irwNd2/absenin/server/dto/mobile"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/utils"
)

type StudentService struct {
	Repo *repositories.StudentRepository
}

func (s *StudentService) Login(payload *web.LoginPayload) (res *web.LoginResponse, err error) {
	user, _ := s.Repo.Login(payload)
	if user.ID == 0 {
		return res, errors.New("record_not_found")
	}

	err = utils.ComparePassword([]byte(*user.Password), payload.Password)
	if err != nil {
		return nil, err
	}

	userClaims := web.Claims{
		ID:    user.ID,
		Email: *user.Email,
		Name:  *user.Name,
		Role:  "Student",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}
	signedAccessToken, err := utils.NewAccessToken(userClaims)

	if err != nil {
		return res, errors.New("access_token_error")
	}
	result := web.LoginResponse{
		AccessToken: signedAccessToken,
		UserId:      "student-" + strconv.Itoa(int(user.ID)),
	}
	return &result, err
}

func (s *StudentService) AddStudent(student *models.Student) error {
	hashedPass, _ := utils.HashPassword(*student.Password)
	student.Password = &hashedPass

	err := s.Repo.AddStudent(student)
	return err
}

func (s *StudentService) GetStudentByTeacherId(teacherID uint64) ([]mobile.StudentDTO, error) {
	students, err := s.Repo.GetStudentByTeacherId(teacherID)
	if err != nil {
		return nil, err
	}

	var studentDTOs []mobile.StudentDTO
	for _, student := range students {
		studentDTO := mobile.StudentDTO{
			UserDataResponse: mobile.UserDataResponse{
				ID:        student.ID,
				Name:      *student.Name,
				Email:     *student.Email,
				UpdatedAt: student.UpdatedAt,
				CreatedAt: student.CreatedAt,
			},
			TeacherID: student.TeacherID,
			Parent: mobile.ParentDTO{
				UserDataResponse: mobile.UserDataResponse{
					ID:        student.ParentID,
					Name:      *student.Parent.Name,
					Email:     *student.Parent.Email,
					UpdatedAt: student.Parent.UpdatedAt,
					CreatedAt: student.Parent.CreatedAt,
				},
			},
		}
		studentDTOs = append(studentDTOs, studentDTO)
	}
	return studentDTOs, err
}
