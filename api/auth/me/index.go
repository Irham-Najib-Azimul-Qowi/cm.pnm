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
	var user models.User
	if err := database.First(&user, "id = ?", claims.UserID).Error; err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
