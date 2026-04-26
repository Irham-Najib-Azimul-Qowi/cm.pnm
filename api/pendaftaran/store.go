package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var pendaftaran models.Pendaftaran
	if err := json.NewDecoder(r.Body).Decode(&pendaftaran); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	// Simple validation
	if pendaftaran.NamaLengkap == "" || pendaftaran.NIM == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Nama and NIM are required"})
		return
	}

	database := db.GetDB()

	// Check if already registered
	var existing models.Pendaftaran
	if err := database.Where("nim = ?", pendaftaran.NIM).First(&existing).Error; err == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "NIM sudah terdaftar"})
		return
	}

	pendaftaran.Status = "pending"
	pendaftaran.IsApproved = false

	if err := database.Create(&pendaftaran).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to save registration"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(pendaftaran)
}
