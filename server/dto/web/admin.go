package web

import "time"

type GetOrgDTO struct {
	Organizations []DataOrgDTO `json:"orgs"`
	Summary       Summary      `json:"summary"`
}

type DataOrgDTO struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	NPSN      string    `json:"npsn"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
type Summary struct {
	TotalData int64 `json:"total_data"`
	Page      int   `json:"page"`
	Limit     int   `json:"limit"`
}
