package db

import (
	"os"
	"sync"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db   *gorm.DB
	once sync.Once
)

func GetDB() *gorm.DB {
	once.Do(func() {
		dsn := os.Getenv("POSTGRES_URL") // Prioritas 1: URL bawaan Vercel Postgres Lama
		if dsn == "" {
			dsn = os.Getenv("DATABASE_URL") // Prioritas 2: URL integrasi Neon Marketplace
		}
		var err error
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			panic("Failed to connect to database: " + err.Error())
		}
	})
	return db
}
