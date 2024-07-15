package models

import "time"

type Student struct {
	ID        uint       `gorm:"primary key;autoIncrement" json:"id"`
	Name      *string    `json:"name"`
	Password  *string    `gorm:"not null" json:"password" binding:"required"`
	Email     *string    `gorm:"unique" json:"email" binding:"required"`
	ParentID  uint       `json:"parent_id"`
	TeacherID uint       `json:"teacher_id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
