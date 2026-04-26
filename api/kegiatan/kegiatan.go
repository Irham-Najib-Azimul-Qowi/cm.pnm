package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(kegiatanHandler)))(w, r)
}

func kegiatanHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	database := db.GetDB()
	var kegiatans []models.Kegiatan
	
	// Complex Filters
	query := database.Preload("User").Order("tanggal_pelaksanaan desc")
	
	year := r.URL.Query().Get("tahun")
	if year != "" {
		query = query.Where("tahun = ?", year)
	}
	
	sifat := r.URL.Query().Get("sifat")
	if sifat != "" {
		query = query.Where("sifat = ?", sifat)
	}

	query.Find(&kegiatans)
	json.NewEncoder(w).Encode(kegiatans)
}
