package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

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
	database.AutoMigrate(
		&models.User{},
		&models.Artikel{},
		&models.Kegiatan{},
		&models.Pendaftaran{},
		&models.Pesan{},
		&models.Pengurus{},
	)

	// Seed initial admin
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	admin := models.User{
		Name:     "Admin Cakra",
		Email:    "admin@cakramanggala.com",
		Password: string(hashedPassword),
		Role:     "admin",
	}
	database.FirstOrCreate(&admin, models.User{Email: "admin@cakramanggala.com"})

	// Seed one article
	database.FirstOrCreate(&models.Artikel{
		Judul:  "Mengenal Navigasi Darat",
		Slug:   "mengenal-navigasi-darat",
		UserID: admin.ID,
		Status: "published",
	}, models.Artikel{Slug: "mengenal-navigasi-darat"})

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"message":"Setup complete. Admin: admin@cakramanggala.com / admin123"}`)
}
