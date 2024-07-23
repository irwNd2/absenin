package models

import "time"

type Subject struct {
	ID                uint                `gorm:"primary key;autoIncrement" json:"id"`
	Name              string              `json:"name"`
	TeacherID         uint                `json:"teacher_id"`
	StudentAttendance []StudentAttendance `gorm:"foreignKey:StudentAttendanceID"`
	CreatedAt         time.Time           `json:"created_at"`
	UpdatedAt         time.Time           `json:"updated_at"`
	DeletedAt         *time.Time          `gorm:"index" json:"deleted_at,omitempty"`
}
