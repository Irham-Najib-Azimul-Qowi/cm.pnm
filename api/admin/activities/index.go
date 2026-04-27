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
	middleware.Recover(middleware.CORS(middleware.JSONResponse(adminActivitiesHandler)))(w, r)
}

func adminActivitiesHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := auth.ValidateToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var keg models.Kegiatan
		if err := database.Where("id = ?", id).First(&keg).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			json.NewEncoder(w).Encode(keg)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&keg)
			database.Save(&keg)
			json.NewEncoder(w).Encode(keg)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&keg)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodPost {
		var keg models.Kegiatan
		json.NewDecoder(r.Body).Decode(&keg)
		keg.UserID = claims.UserID
		database.Create(&keg)
		json.NewEncoder(w).Encode(keg)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
