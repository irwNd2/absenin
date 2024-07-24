package models

import "time"

type StudentAttendance struct {
	ID                      uint                      `gorm:"primary key;autoIncrement" json:"id"`
	StudentClassID          uint                      `json:"student_class_id"`
	StudentClass            StudentClass              `gorm:"foreignKey:StudentClassID" json:"student_class"`
	SubjectID               uint                      `json:"subject_id"`
	Subject                 Subject                   `gorm:"foreignKey:SubjectID" json:"subject"`
	TeacherID               uint                      `json:"teacher_id"`
	Time                    time.Time                 `json:"time"`
	StudentAttendanceDetail []StudentAttendanceDetail `gorm:"foreignKey:StudentAttendanceID"`
	OrganizationID          uint                      `json:"org_id"`
	CreatedAt               time.Time                 `json:"created_at"`
	UpdatedAt               time.Time                 `json:"updated_at"`
	DeletedAt               *time.Time                `gorm:"index" json:"deleted_at,omitempty"`
}
