package services

import (
	"errors"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
	"github.com/irwNd2/absenin/server/utils"
)

type TeacherService struct {
	Repo *repositories.TeacherRepository
}

func (s *TeacherService) Login(payload *web.LoginPayload) (res *web.LoginResponse, err error) {
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
		Role:  "Teacher",
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
		UserId:      "teacher-" + strconv.Itoa(int(user.ID)),
	}
	return &result, err
}

func (s *TeacherService) AddTeacher(teacher *models.Teacher) error {
	hashedPass, _ := utils.HashPassword(*teacher.Password)
	teacher.Password = &hashedPass

	err := s.Repo.AddTeacher(teacher)
	return err
}
