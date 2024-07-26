package web

type GetAllClassesDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type StudentByClassDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	NISN string `json:"nisn"`
}
