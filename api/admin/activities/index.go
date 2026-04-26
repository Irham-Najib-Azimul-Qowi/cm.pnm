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
