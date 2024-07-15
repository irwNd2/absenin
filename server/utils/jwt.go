package utils

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/irwNd2/absenin/server/dto/web"
)

func NewAccessToken(claim web.Claims) (string, error) {
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	return accessToken.SignedString([]byte(os.Getenv("SECRET_JWT")))
}

func ParseAccessToken(accessToken string) *web.Claims {
	parsedAccessToken, _ := jwt.ParseWithClaims(accessToken, &web.Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_JWT")), nil
	})

	return parsedAccessToken.Claims.(*web.Claims)
}
