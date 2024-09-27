package models

import "time"

type Admin struct {
	ID        uint       `gorm:"primary key;autoIncrement" json:"id"`
	Name      string     `json:"name"`
	Email     string     `gorm:"unique" json:"email" binding:"required"`
	Password  string     `gorm:"not null" json:"password" binding:"required"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
