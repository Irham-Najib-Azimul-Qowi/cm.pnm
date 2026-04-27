package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(articlesHandler)))(w, r)
}

func articlesHandler(w http.ResponseWriter, r *http.Request) {
	database := db.GetDB()

	slug := r.URL.Query().Get("slug")
	if slug != "" {
		var artikel models.Artikel
		if err := database.Preload("User").Where("slug = ?", slug).First(&artikel).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		database.Model(&artikel).Update("views", artikel.Views+1)
		json.NewEncoder(w).Encode(artikel)
		return
	}

	var artikels []models.Artikel

	query := database.Preload("User").Order("created_at desc")

	search := r.URL.Query().Get("search")
	if search != "" {
		query = query.Where("judul ILIKE ?", "%"+search+"%")
	}

	status := r.URL.Query().Get("status")
	if status != "" {
		query = query.Where("status = ?", status)
	} else {
		query = query.Where("status = ?", "published")
	}

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page == 0 {
		page = 1
	}
	perPage, _ := strconv.Atoi(r.URL.Query().Get("per_page"))
	if perPage == 0 {
		perPage = 6
	}

	var total int64
	query.Model(&models.Artikel{}).Count(&total)

	query.Offset((page - 1) * perPage).Limit(perPage).Find(&artikels)

	// Admin stats included for dashboard
	var totalViews int64
	database.Model(&models.Artikel{}).Select("sum(views)").Scan(&totalViews)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": artikels,
		"meta": map[string]interface{}{
			"current_page": page,
			"last_page":    (total + int64(perPage) - 1) / int64(perPage),
			"total":        total,
		},
		"stats": map[string]interface{}{
			"total_views": totalViews,
			"total":       total,
		},
	})
}
