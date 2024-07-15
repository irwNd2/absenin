package models

import "time"

type Notification struct {
	ID        uint       `gorm:"primary key;autoIncrement" json:"id"`
	ExpoToken string     `json:"expo_token"`
	Message   string     `gorm:"type:text;not null" json:"message"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
