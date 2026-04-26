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

	var pesan models.Pesan
	if err := json.NewDecoder(r.Body).Decode(&pesan); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if pesan.Nama == "" || pesan.Email == "" || pesan.Pesan == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "All fields are required"})
		return
	}

	database := db.GetDB()
	if err := database.Create(&pesan).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to send message"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Pesan berhasil dikirim"})
}
