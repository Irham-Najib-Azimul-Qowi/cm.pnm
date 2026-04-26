package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/auth"
	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/img"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(activitiesAdminHandler)))(w, r)
}

func activitiesAdminHandler(w http.ResponseWriter, r *http.Request) {
	// Auth Check
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
		var kegiatan models.Kegiatan
		if err := json.NewDecoder(r.Body).Decode(&kegiatan); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		kegiatan.GambarUtama = img.ProcessImageURL(kegiatan.GambarUtama)
		kegiatan.UserID = claims.UserID
		
		if err := database.Create(&kegiatan).Error; err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(kegiatan)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
