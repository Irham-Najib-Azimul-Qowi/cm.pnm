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
	middleware.Recover(middleware.CORS(middleware.JSONResponse(adminArticlesHandler)))(w, r)
}

func adminArticlesHandler(w http.ResponseWriter, r *http.Request) {
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
		var art models.Artikel
		if err := database.Where("id = ?", id).First(&art).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			json.NewEncoder(w).Encode(art)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&art)
			database.Save(&art)
			json.NewEncoder(w).Encode(art)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&art)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodGet {
		var articles []models.Artikel
		database.Preload("User").Order("created_at desc").Find(&articles)
		json.NewEncoder(w).Encode(articles)
		return
	}

	if r.Method == http.MethodPost {
		var art models.Artikel
		json.NewDecoder(r.Body).Decode(&art)
		art.UserID = claims.UserID
		database.Create(&art)
		json.NewEncoder(w).Encode(art)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
