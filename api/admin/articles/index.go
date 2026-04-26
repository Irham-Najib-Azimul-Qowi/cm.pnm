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
