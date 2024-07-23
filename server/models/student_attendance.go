package models

import "time"

type StudentAttendance struct {
	ID                      uint                      `gorm:"primary key;autoIncrement" json:"id"`
	StudentClassID          uint                      `json:"student_class_id"`
	SubjectID               uint                      `json:"subject_id"`
	TeacherID               uint                      `json:"teacher_id"`
	StudentAttendanceDetail []StudentAttendanceDetail `gorm:"foreignKey:StudentAttendanceID"`
	CreatedAt               time.Time                 `json:"created_at"`
	UpdatedAt               time.Time                 `json:"updated_at"`
	DeletedAt               *time.Time                `gorm:"index" json:"deleted_at,omitempty"`
}
