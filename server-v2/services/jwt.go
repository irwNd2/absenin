package services

import (
	"os"
	"time"

	"github.com/absenin/server-v2/models"
	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct {
	secretKey []byte
}

func NewJWTService() *JWTService {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "your-secret-key" // In production, always use a secure secret key
	}
	return &JWTService{
		secretKey: []byte(secretKey),
	}
}

type Claims struct {
	TeacherID string `json:"teacherId"`
	Email     string `json:"email"`
	jwt.RegisteredClaims
}

func (s *JWTService) GenerateToken(teacher *models.Teacher) (string, error) {
	claims := Claims{
		TeacherID: teacher.ID,
		Email:     teacher.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token expires in 24 hours
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.secretKey)
}

func (s *JWTService) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return s.secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
