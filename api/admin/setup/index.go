package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/models"
	"golang.org/x/crypto/bcrypt"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")
	if key != "setup_123" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	database := db.GetDB()

	// Sync Schema
	err := database.AutoMigrate(
		&models.User{},
		&models.Artikel{},
		&models.Kegiatan{},
		&models.Pendaftaran{},
		&models.Pesan{},
		&models.Pengurus{},
	)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to migrate: " + err.Error()})
		return
	}

	var count int64
	database.Model(&models.User{}).Count(&count)
	if count == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := models.User{
			Name:     "Admin Cakra Manggala",
			Email:    "admin@cakramanggala.com",
			Password: string(hashedPassword),
			Role:     "admin",
		}
		database.Create(&admin)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Migration and seeding successful"})
}
