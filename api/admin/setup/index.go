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
	// Seed initial admin
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	admin := models.User{
		Name:     "Admin Cakra",
		Email:    "admin@cakramanggala.com",
		Password: string(hashedPassword),
		Role:     "admin",
	}
	database.FirstOrCreate(&admin, models.User{Email: "admin@cakramanggala.com"})

	// Seed some articles
	articles := []models.Artikel{
		{
			Judul:        "Mengenal Navigasi Darat",
			Slug:         "mengenal-navigasi-darat",
			Excerpt:      "Dasar-dasar navigasi darat menggunakan peta dan kompas di alam bebas.",
			Konten:       "<p>Navigasi darat adalah ilmu untuk menentukan posisi dan arah perjalanan...</p>",
			GambarUtama:  "https://images.unsplash.com/photo-1512100356956-c1227c32915a?q=80&w=1000&auto=format&fit=crop",
			Status:       "published",
			UserID:       admin.ID,
		},
		{
			Judul:        "Laporan Ekspedisi Gunung Semeru",
			Slug:         "laporan-ekspedisi-gunung-semeru",
			Excerpt:      "Catatan perjalanan tim Cakra Manggala menapaki puncak tertinggi Jawa.",
			Konten:       "<p>Gunung Semeru memberikan pelajaran berharga tentang ketabahan...</p>",
			GambarUtama:  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
			Status:       "published",
			UserID:       admin.ID,
		},
	}
	for _, art := range articles {
		database.FirstOrCreate(&art, models.Artikel{Slug: art.Slug})
	}

	// Seed some activities
	activities := []models.Kegiatan{
		{
			JudulKegiatan:      "DIKSAR XV",
			Tahun:              2023,
			TanggalPelaksanaan: time.Now().AddDate(-1, 0, 0),
			Tempat:             "Lereng Lawu",
			Materi:             "Pendidikan dasar mental dan fisik anggota baru.",
			Sifat:              "internal",
			UserID:             admin.ID,
		},
		{
			JudulKegiatan:      "Bakwan Sosial 2024",
			Tahun:              2024,
			TanggalPelaksanaan: time.Now(),
			Tempat:             "Madiun",
			Materi:             "Aksi kepedulian masyarakat sekitar kampus.",
			Sifat:              "eksternal",
			UserID:             admin.ID,
		},
	}
	for _, act := range activities {
		database.Where(models.Kegiatan{JudulKegiatan: act.JudulKegiatan}).FirstOrCreate(&act)
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"message":"Setup complete. Admin: admin@cakramanggala.com / admin123"}`)
}
