package models

import (
	"database/sql/driver"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Organization struct {
	gorm.Model
	ID        string    `gorm:"primaryKey"`
	Name      string    `gorm:"not null"`
	Address   string    `gorm:"not null"`
	Email     string    `gorm:"unique;not null"`
	Teachers  []Teacher `gorm:"foreignKey:OrganizationID"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type Teacher struct {
	gorm.Model
	ID             string       `gorm:"primaryKey"`
	Name           string       `gorm:"not null"`
	Email          string       `gorm:"unique;not null"`
	Password       string       `gorm:"not null"`
	PhoneNumber    string       `gorm:"not null"`
	Department     string       `gorm:"not null"`
	EmployeeId     string       `gorm:"not null"`
	Subjects       Subjects     `gorm:"type:text[]"`
	OrganizationID string       `gorm:"not null"`
	Organization   Organization `gorm:"foreignKey:OrganizationID"`
	CreatedAt      time.Time    `gorm:"autoCreateTime"`
	UpdatedAt      time.Time    `gorm:"autoUpdateTime"`
}

// Subjects is a custom type to handle PostgreSQL array
type Subjects []string

// Value implements the driver.Valuer interface
func (s Subjects) Value() (driver.Value, error) {
	if s == nil {
		return nil, nil
	}
	return "{" + strings.Join(s, ",") + "}", nil
}

// Scan implements the sql.Scanner interface
func (s *Subjects) Scan(value interface{}) error {
	if value == nil {
		*s = nil
		return nil
	}

	// Convert the value to a string
	str, ok := value.(string)
	if !ok {
		return nil
	}

	// Remove the curly braces
	str = str[1 : len(str)-1]

	// Split the string by comma
	*s = Subjects{}
	if str != "" {
		*s = strings.Split(str, ",")
	}
	return nil
}

// HashPassword hashes a password using bcrypt
func (t *Teacher) HashPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	t.Password = string(hashedPassword)
	return nil
}

type Class struct {
	gorm.Model
	ID        string    `gorm:"primaryKey"`
	Name      string    `gorm:"not null"`
	Students  []Student `gorm:"many2many:class_students;joinForeignKey:ClassID;joinReferences:StudentID"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type Student struct {
	gorm.Model
	ID        string    `gorm:"primaryKey"`
	Name      string    `gorm:"not null"`
	Classes   []Class   `gorm:"many2many:class_students;joinForeignKey:StudentID;joinReferences:ClassID"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type ClassStudent struct {
	gorm.Model
	ClassID   string    `gorm:"primaryKey"`
	StudentID string    `gorm:"primaryKey"`
	Class     Class     `gorm:"foreignKey:ClassID"`
	Student   Student   `gorm:"foreignKey:StudentID"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type Attendance struct {
	gorm.Model
	ID        string    `gorm:"primaryKey"`
	TeacherID string    `gorm:"not null"`
	Subject   string    `gorm:"not null"`
	ClassName string    `gorm:"not null"`
	Date      time.Time `gorm:"not null"`
	Students  []StudentAttendance
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type StudentAttendance struct {
	gorm.Model
	ID           string    `gorm:"primaryKey"`
	AttendanceID string    `gorm:"not null"`
	StudentID    string    `gorm:"not null"`
	Status       string    `gorm:"not null;check:status IN ('present','sick','absent')"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime"`
}
