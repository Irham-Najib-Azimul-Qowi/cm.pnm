package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/auth"
	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// Auth Check
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	_, err := auth.ValidateToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Extract ID
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	id := pathParts[len(pathParts)-1]

	database := db.GetDB()
	var artikel models.Artikel

	if err := database.Where("id = ?", id).First(&artikel).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Artikel not found"})
		return
	}

	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(artikel)
		return
	}

	if r.Method == http.MethodPut || r.Method == http.MethodPatch {
		var updateData models.Artikel
		if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		database.Model(&artikel).Updates(updateData)
		
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(artikel)
		return
	}

	if r.Method == http.MethodDelete {
		database.Delete(&artikel)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
