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
	middleware.Recover(middleware.CORS(middleware.JSONResponse(articlesAdminDetailHandler)))(w, r)
}

func articlesAdminDetailHandler(w http.ResponseWriter, r *http.Request) {
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

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	id := pathParts[len(pathParts)-1]

	database := db.GetDB()
	var artikel models.Artikel

	if err := database.Where("id = ?", id).First(&artikel).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(artikel)
		return
	}

	if r.Method == http.MethodPut || r.Method == http.MethodPatch {
		json.NewDecoder(r.Body).Decode(&artikel)
		database.Save(&artikel)
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
