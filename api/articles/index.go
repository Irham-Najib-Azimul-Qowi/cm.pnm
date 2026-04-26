package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	database := db.GetDB()

	search := r.URL.Query().Get("search")
	status := r.URL.Query().Get("status")
	perPageStr := r.URL.Query().Get("per_page")
	pageStr := r.URL.Query().Get("page")

	perPage := 10
	if p, err := strconv.Atoi(perPageStr); err == nil && p > 0 {
		perPage = p
	}

	page := 1
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}

	query := database.Model(&models.Artikel{}).Preload("User").Order("created_at desc")

	if search != "" {
		query = query.Where("judul LIKE ? OR konten LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if status != "" {
		query = query.Where("status = ?", status)
	}

	var total int64
	query.Count(&total)

	var artikels []models.Artikel
	offset := (page - 1) * perPage
	query.Limit(perPage).Offset(offset).Find(&artikels)

	// Stats
	var totalPublished int64
	var totalDraft int64
	var totalViews int64
	database.Model(&models.Artikel{}).Where("status = ?", "published").Count(&totalPublished)
	database.Model(&models.Artikel{}).Where("status = ?", "draft").Count(&totalDraft)
	database.Model(&models.Artikel{}).Select("sum(views)").Row().Scan(&totalViews)

	response := map[string]interface{}{
		"data": artikels,
		"meta": map[string]interface{}{
			"total":        total,
			"page":         page,
			"per_page":     perPage,
			"last_page":    (total + int64(perPage) - 1) / int64(perPage),
		},
		"stats": map[string]interface{}{
			"total":       total,
			"published":   totalPublished,
			"draft":       totalDraft,
			"total_views": totalViews,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
