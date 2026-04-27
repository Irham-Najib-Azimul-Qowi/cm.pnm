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
	middleware.Recover(middleware.CORS(middleware.JSONResponse(adminPengurusHandler)))(w, r)
}

func adminPengurusHandler(w http.ResponseWriter, r *http.Request) {
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
		var o models.Pengurus
		if err := database.Where("id = ?", id).First(&o).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			json.NewEncoder(w).Encode(o)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&o)
			database.Save(&o)
			json.NewEncoder(w).Encode(o)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&o)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodPost {
		var o models.Pengurus
		json.NewDecoder(r.Body).Decode(&o)
		database.Create(&o)
		json.NewEncoder(w).Encode(o)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
