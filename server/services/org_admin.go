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

type OrgAdminService struct {
	Repo *repositories.OrgAdminRepository
}

func (s *OrgAdminService) OrgAdminLogin(p *web.LoginPayload) (res *web.LoginResponse, err error) {
	orgAdmin, _ := s.Repo.OrgAdminLogin(p)
	if orgAdmin.ID == 0 {
		return res, errors.New("record_not_found")
	}

	err = utils.ComparePassword([]byte(orgAdmin.Password), p.Password)
	if err != nil {
		return nil, err
	}

	orgAdminClaims := web.Claims{
		ID:    orgAdmin.ID,
		Email: orgAdmin.Email,
		Name:  orgAdmin.Name,
		Role:  "Operator",
		OrgID: orgAdmin.OrganizationID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 12)),
		},
	}

	signedAccessToken, err := utils.NewAccessToken(orgAdminClaims)

	if err != nil {
		return res, errors.New("access_token_error")
	}

	result := web.LoginResponse{
		AccessToken: signedAccessToken,
		UserId:      strconv.Itoa(int(orgAdmin.ID)),
	}
	return &result, err
}

func (s *OrgAdminService) AddOrgAdmin(orgAdmin *models.OrgAdmin) error {
	hashedPass, _ := utils.HashPassword(orgAdmin.Password)
	orgAdmin.Password = hashedPass

	return s.Repo.AddOrgAdmin(orgAdmin)
}

func (s *OrgAdminService) GetAllOrgAdmin(page, limit int) (*web.GetOrgAdminDTO, error) {
	offset := (page - 1) * limit
	var totalData int64

	err := s.Repo.DB.Model(&models.OrgAdmin{}).Count(&totalData).Error
	if err != nil {
		return nil, err
	}

	orgAdmins, err := s.Repo.GetAll(limit, offset)
	if err != nil {
		return nil, err
	}

	adminRes := web.GetOrgAdminDTO{
		OrgAdmin: make([]web.DataOrgAdmin, len(orgAdmins)),
		Summary: web.Summary{
			TotalData: totalData,
			Page:      page,
			Limit:     limit,
		},
	}

	for i, admin := range orgAdmins {
		adminRes.OrgAdmin[i] = web.DataOrgAdmin{
			ID:    admin.ID,
			Name:  admin.Name,
			NIP:   admin.NIP,
			Email: admin.Email,
			Organization: web.OrgData{
				ID:   admin.Organization.ID,
				Name: *admin.Organization.Name,
			},
			CreatedAt: admin.CreatedAt,
			UpdatedAt: admin.UpdatedAt,
		}
	}

	return &adminRes, nil
}
