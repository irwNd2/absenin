package services

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
)

type StudentAttendanceService struct {
	Repo *repositories.StudentAttendanceRepository
}

func (s *StudentAttendanceService) AddStudentAttendance(attendance *models.StudentAttendance) (*models.StudentAttendance, error) {
	data, err := s.Repo.AddStudentAttendance(attendance)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (s *StudentAttendanceService) GetAllByTeacher(teacherID uint) ([]web.GetStudentAttendanceByTeacherDTO, error) {
	attendances, err := s.Repo.GetAllByTeacher(teacherID)
	if err != nil {
		return nil, err
	}
	var attendanceDTOs []web.GetStudentAttendanceByTeacherDTO

	for _, attendance := range attendances {
		attnedanceDTO := web.GetStudentAttendanceByTeacherDTO{
			ID:             attendance.ID,
			StudentClassID: attendance.StudentClassID,
			StudentClass: web.GetAllClassesDTO{
				ID:   attendance.StudentClass.ID,
				Name: *attendance.StudentClass.Name,
			},
			SubjectID: attendance.SubjectID,
			Subject: web.GetAllSubjectDTO{
				ID:   attendance.Subject.ID,
				Name: *attendance.Subject.Name,
			},
			TeacherID:               attendance.TeacherID,
			Time:                    &attendance.Time,
			StudentAttendanceDetail: &attendance.StudentAttendanceDetail,
		}
		attendanceDTOs = append(attendanceDTOs, attnedanceDTO)
	}
	return attendanceDTOs, nil
}
