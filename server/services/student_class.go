package services

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/repositories"
)

type StudentClassService struct {
	Repo *repositories.StudentClassRepository
}

func (s *StudentClassService) GetAllClasses(orgID uint) ([]web.GetAllClassesDTO, error) {
	classes, err := s.Repo.GetAllClasses(orgID)
	if err != nil {
		return nil, err
	}
	var classDTOs []web.GetAllClassesDTO
	for _, class := range classes {
		classDTO := web.GetAllClassesDTO{
			ID:   class.ID,
			Name: *class.Name,
		}
		classDTOs = append(classDTOs, classDTO)
	}
	return classDTOs, nil
}
