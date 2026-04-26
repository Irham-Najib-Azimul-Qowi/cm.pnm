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
	// 1. Auth Check
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := auth.ValidateToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	database := db.GetDB()

	if r.Method == http.MethodPost {
		var artikel models.Artikel
		if err := json.NewDecoder(r.Body).Decode(&artikel); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		artikel.UserID = claims.UserID
		if err := database.Create(&artikel).Error; err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(artikel)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
