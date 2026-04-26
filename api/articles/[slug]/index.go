package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(articleDetailHandler)))(w, r)
}

func articleDetailHandler(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	slug := pathParts[len(pathParts)-1]

	database := db.GetDB()
	var artikel models.Artikel

	if err := database.Preload("User").Where("slug = ?", slug).First(&artikel).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	database.Model(&artikel).Update("views", artikel.Views+1)
	json.NewEncoder(w).Encode(artikel)
}
