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
	middleware.Recover(middleware.CORS(middleware.JSONResponse(activitiesAdminDetailHandler)))(w, r)
}

func activitiesAdminDetailHandler(w http.ResponseWriter, r *http.Request) {
	// Auth Check ... Standard ...
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

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	id := pathParts[len(pathParts)-1]

	database := db.GetDB()
	var kegiatan models.Kegiatan

	if err := database.Where("id = ?", id).First(&kegiatan).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(kegiatan)
		return
	}

	if r.Method == http.MethodPut || r.Method == http.MethodPatch {
		json.NewDecoder(r.Body).Decode(&kegiatan)
		database.Save(&kegiatan)
		json.NewEncoder(w).Encode(kegiatan)
		return
	}

	if r.Method == http.MethodDelete {
		database.Delete(&kegiatan)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
