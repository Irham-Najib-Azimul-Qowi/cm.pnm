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

	database := db.GetDB()

	if r.Method == http.MethodGet {
		var pesan []models.Pesan
		database.Order("created_at desc").Find(&pesan)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(pesan)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
