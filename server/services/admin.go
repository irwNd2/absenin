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

type AdminService struct {
	Repo *repositories.AdminRepository
}

func (s *AdminService) AdminLogin(p *web.LoginPayload) (res *web.LoginResponse, err error) {
	admin, _ := s.Repo.AdminLogin(p)
	if admin.ID == 0 {
		return res, errors.New("record_not_found")
	}

	err = utils.ComparePassword([]byte(admin.Password), p.Password)
	if err != nil {
		return nil, err
	}

	adminClaims := web.Claims{
		ID:    admin.ID,
		Email: admin.Email,
		Name:  admin.Name,
		Role:  "Admin",
		OrgID: 0,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 12)),
		},
	}

	signedAccessToken, err := utils.NewAccessToken(adminClaims)

	if err != nil {
		return res, errors.New("access_token_error")
	}

	result := web.LoginResponse{
		AccessToken: signedAccessToken,
		UserId:      strconv.Itoa(int(admin.ID)),
	}

	return &result, err
}

func (s *AdminService) AddAdmin(admin *models.Admin) error {
	hashedPass, _ := utils.HashPassword(admin.Password)
	admin.Password = hashedPass

	return s.Repo.AddAdmin(admin)
}
