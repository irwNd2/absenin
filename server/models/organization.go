package models

import "time"

type Organization struct {
	ID        uint       `gorm:"primary key;autoIncrement" json:"id"`
	Name      string     `json:"name"`
	NPSN      string     `json:"npsn"`
	Address   string     `json:"address"`
	Teacher   []Teacher  `gorm:"foreignKey:OrganizationID"`
	Student   []Student  `gorm:"foreignKey:OrganizationID"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
