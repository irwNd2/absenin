package services

import (
	"github.com/irwNd2/absenin/server/dto/web"
	"github.com/irwNd2/absenin/server/models"
	"github.com/irwNd2/absenin/server/repositories"
)

type StudentAttendanceService struct {
	Repo *repositories.StudentAttendanceRepository
}

func (s *StudentAttendanceService) AddStudentAttendance(payload *web.AddStudentAttendancePayload, orgID uint) (*models.StudentAttendance, error) {
	attendance := models.StudentAttendance{
		SubjectID:      payload.SubjectID,
		StudentClassID: payload.StudentClassID,
		TeacherID:      payload.TeacherID,
		OrganizationID: orgID,
		Time:           *payload.Time,
	}
	data, err := s.Repo.AddStudentAttendance(&attendance)

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
		timeCopy := attendance.Time // makanya belajar pointer & reference terutama untuk type data primitif dan type struc kayak time.Time wkwk
		attendanceDTO := web.GetStudentAttendanceByTeacherDTO{
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
			Time:                    &timeCopy,
			StudentAttendanceDetail: &attendance.StudentAttendanceDetail,
		}
		attendanceDTOs = append(attendanceDTOs, attendanceDTO)
	}
	return attendanceDTOs, nil
}
