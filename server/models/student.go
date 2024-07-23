package models

import "time"

type Student struct {
	ID                      uint                      `gorm:"primary key;autoIncrement" json:"id"`
	Name                    *string                   `json:"name"`
	Password                *string                   `gorm:"not null" json:"password" binding:"required"`
	Email                   *string                   `gorm:"unique" json:"email" binding:"required"`
	NISN                    string                    `json:"nisn"`
	ExpoToken               *string                   `json:"expo_token"`
	ParentID                uint                      `json:"parent_id"`
	Parent                  Parent                    `gorm:"foreignKey:ParentID"`
	TeacherID               uint                      `json:"teacher_id"`
	OrganizationID          uint                      `json:"org_id"`
	StudentClassID          uint                      `json:"student_class_id"`
	StudentAttendanceDetail []StudentAttendanceDetail `gorm:"foreignKey:StudentID"`
	CreatedAt               time.Time                 `json:"created_at"`
	UpdatedAt               time.Time                 `json:"updated_at"`
	DeletedAt               *time.Time                `gorm:"index" json:"deleted_at,omitempty"`
}
