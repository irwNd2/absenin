package web

import "github.com/golang-jwt/jwt/v5"

type Claims struct {
	ID    uint   `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
	OrgID uint   `json:"org_id"`
	jwt.RegisteredClaims
}
