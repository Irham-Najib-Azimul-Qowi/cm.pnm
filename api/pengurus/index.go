package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	database := db.GetDB()
	var penguruses []models.Pengurus

	database.Where("status = ?", "active").Order("urutan asc").Find(&penguruses)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(penguruses)
}
