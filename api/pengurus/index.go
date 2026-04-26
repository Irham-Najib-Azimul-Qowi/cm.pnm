package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(pengurusHandler)))(w, r)
}

func pengurusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	database := db.GetDB()
	var pengurus []models.Pengurus
	database.Order("urutan asc").Find(&pengurus)
	json.NewEncoder(w).Encode(pengurus)
}
