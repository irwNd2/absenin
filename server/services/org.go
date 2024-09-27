package services

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
)

type OrganizationService struct {
	Repo *repositories.OrganizationRepository
}

func (s *OrganizationService) AddOrg(org *models.Organization) error {
	return s.Repo.AddOrg(org)
}

func (s *OrganizationService) GetAllOrg(page, limit int) (*web.GetOrgDTO, error) {
	offset := (page - 1) * limit

	var totalData int64

	err := s.Repo.DB.Model(&models.Organization{}).Count(&totalData).Error

	if err != nil {
		return nil, err
	}

	orgs, err := s.Repo.GetAllOrg(limit, offset)

	if err != nil {
		return nil, err
	}

	orgRes := web.GetOrgDTO{
		Organizations: make([]web.DataOrgDTO, len(orgs)),
		Summary: web.Summary{
			TotalData: totalData,
			Page:      page,
			Limit:     limit,
		},
	}

	for i, org := range orgs {
		orgRes.Organizations[i] = web.DataOrgDTO{
			ID:        org.ID,
			Name:      *org.Name,
			NPSN:      *org.NPSN,
			Address:   *org.Address,
			CreatedAt: org.CreatedAt,
			UpdatedAt: org.UpdatedAt,
		}
	}

	return &orgRes, nil
}
