package models

import "time"

type OrgAdmin struct {
	ID             uint         `gorm:"primary key;autoIncrement" json:"id"`
	Name           string       `json:"name"`
	NIP            string       `json:"nip"`
	Email          string       `gorm:"unique" json:"email" binding:"required"`
	Password       string       `gorm:"not null" json:"password" binding:"required"`
	OrganizationID uint         `json:"org_id"`
	Organization   Organization `gorm:"foreignKey:OrganizationID" json:"organization"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
	DeletedAt      *time.Time   `gorm:"index" json:"deleted_at,omitempty"`
}
