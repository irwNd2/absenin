package models

import "time"

type StudentAttendanceDetail struct {
	ID                  uint       `gorm:"primary key;autoIncrement" json:"id"`
	StudentID           uint       `json:"student_id"`
	StudentAttendanceID uint       `json:"student_attendance_id"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
	DeletedAt           *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
