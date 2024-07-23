package services

import (
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
)

type SubjectService struct {
	Repo *repositories.SubjectRepository
}

func (s *SubjectService) GetAllSubjectByOrgID(orgID uint) ([]models.Subject, error) {
	subjects, err := s.Repo.GetAllSubjectByOrgID(orgID)

	if err != nil {
		return nil, err
	}
	return subjects, nil
}

func (s *SubjectService) GetTeacherSubject(orgID uint, teacherID uint) ([]models.Subject, error) {
	subjects, err := s.Repo.GetTeacherSubject(orgID, teacherID)
	if err != nil {
		return nil, err
	}
	return subjects, nil
}
