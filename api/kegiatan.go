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
	var kegiatans []models.Kegiatan

	year := r.URL.Query().Get("year")
	sifat := r.URL.Query().Get("sifat")

	query := database.Order("tanggal_pelaksanaan desc")
	if year != "" {
		query = query.Where("tahun = ?", year)
	}
	if sifat != "" {
		query = query.Where("sifat = ?", sifat)
	}

	query.Find(&kegiatans)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(kegiatans)
}
