package models

import "time"

type Parent struct {
	ID        uint      `gorm:"primary key;autoIncrement" json:"id"`
	Name      *string   `json:"name"`
	Password  *string   `gorm:"not null" json:"password" binding:"required"`
	Email     *string   `gorm:"unique" json:"email" binding:"required"`
	Student   []Student `gorm:"foreignKey:ParentID"`
	ExpoToken *string   `json:"expo_token"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
