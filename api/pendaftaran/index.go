package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(pendaftaranHandler)))(w, r)
}

func pendaftaranHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var p models.Pendaftaran
	json.NewDecoder(r.Body).Decode(&p)
	p.Status = "pending"

	database := db.GetDB()
	database.Create(&p)
	json.NewEncoder(w).Encode(p)
}
