package app

import (
	"fmt"

	"github.com/irwNd2/absenin/server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     string
	Password string
	User     string
	DBname   string
	SSLMode  string
}

func NewConnection(config *Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Password, config.DBname, config.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(&models.Parent{}, &models.Organization{}, &models.StudentClass{}, &models.Teacher{}, &models.Student{}, &models.Notification{}, &models.Subject{}, &models.StudentAttendance{}, &models.StudentAttendanceDetail{}, &models.Admin{}, &models.OrgAdmin{})
}
