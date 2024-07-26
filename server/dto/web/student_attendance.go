package web

import (
	"time"

	"github.com/irwNd2/absenin/server/models"
)

type GetStudentAttendanceByTeacherDTO struct {
	ID                      uint                              `json:"id"`
	StudentClassID          uint                              `json:"student_class_id"`
	StudentClass            GetAllClassesDTO                  `json:"student_class"`
	SubjectID               uint                              `json:"subject_id"`
	Subject                 GetAllSubjectDTO                  `json:"subject"`
	TeacherID               uint                              `json:"teacher_id"`
	Time                    *time.Time                        `json:"time"`
	StudentAttendanceDetail *[]models.StudentAttendanceDetail `json:"student_attendance"`
}

type AddStudentAttendancePayload struct {
	StudentClassID uint       `json:"student_class_id"`
	SubjectID      uint       `json:"subject_id"`
	TeacherID      uint       `json:"teacher_id"`
	Time           *time.Time `json:"time"`
}

type AddStudentAttendanceResponse struct {
	ID uint `json:"id"`
}
