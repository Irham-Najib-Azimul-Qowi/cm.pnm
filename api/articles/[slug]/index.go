package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	slug := pathParts[len(pathParts)-1]

	if slug == "" || slug == "articles" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Slug is required"})
		return
	}

	database := db.GetDB()
	var artikel models.Artikel

	result := database.Preload("User").Where("slug = ?", slug).First(&artikel)
	if result.Error != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Artikel not found"})
		return
	}

	database.Model(&artikel).Update("views", artikel.Views+1)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artikel)
}
