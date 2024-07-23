package services

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/repositories"
)

type SubjectService struct {
	Repo *repositories.SubjectRepository
}

func (s *SubjectService) GetAllSubjectByOrgID(orgID uint) ([]web.GetAllSubjectDTO, error) {
	subjects, err := s.Repo.GetAllSubjectByOrgID(orgID)

	if err != nil {
		return nil, err
	}

	var subjectDTOs []web.GetAllSubjectDTO
	for _, subject := range subjects {
		subjectDTO := web.GetAllSubjectDTO{
			ID:   subject.ID,
			Name: *subject.Name,
		}

		subjectDTOs = append(subjectDTOs, subjectDTO)
	}

	return subjectDTOs, nil
}

func (s *SubjectService) GetTeacherSubject(orgID uint, teacherID uint) ([]web.GetAllSubjectDTO, error) {
	subjects, err := s.Repo.GetTeacherSubject(orgID, teacherID)
	if err != nil {
		return nil, err
	}
	var subjectDTOs []web.GetAllSubjectDTO
	for _, subject := range subjects {
		subjectDTO := web.GetAllSubjectDTO{
			ID:   subject.ID,
			Name: *subject.Name,
		}

		subjectDTOs = append(subjectDTOs, subjectDTO)
	}
	return subjectDTOs, nil
}
