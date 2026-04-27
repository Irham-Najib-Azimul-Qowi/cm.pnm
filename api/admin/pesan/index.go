package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/auth"
	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(adminPesanHandler)))(w, r)
}

func adminPesanHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	_, err := auth.ValidateToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var m models.Pesan
		if err := database.Where("id = ?", id).First(&m).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&m)
			database.Save(&m)
			json.NewEncoder(w).Encode(m)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&m)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodGet {
		var messages []models.Pesan
		database.Order("created_at desc").Find(&messages)
		json.NewEncoder(w).Encode(messages)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
