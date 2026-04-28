package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/auth"
	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(adminHandler)))(w, r)
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	switch routeSegment(r, "/api/admin") {
	case "articles":
		adminArticlesHandler(w, r)
	case "pengurus":
		adminPengurusHandler(w, r)
	case "pendaftaran":
		adminPendaftaranHandler(w, r)
	case "activities":
		adminActivitiesHandler(w, r)
	case "pesan":
		adminPesanHandler(w, r)
	case "setup":
		adminSetupHandler(w, r)
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}

func routeSegment(r *http.Request, prefix string) string {
	if route := strings.Trim(r.URL.Query().Get("route"), "/"); route != "" {
		return route
	}

	path := strings.TrimPrefix(r.URL.Path, prefix)
	return strings.Trim(path, "/")
}

func adminUser(w http.ResponseWriter, r *http.Request) (*models.User, bool) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := auth.ValidateToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return nil, false
	}

	database := db.GetDB()
	var user models.User
	if err := database.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return nil, false
	}

	return &user, true
}

func adminArticlesHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := adminUser(w, r)
	if !ok {
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var art models.Artikel
		if err := database.Where("id = ?", id).First(&art).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			json.NewEncoder(w).Encode(art)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&art)
			database.Save(&art)
			json.NewEncoder(w).Encode(art)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&art)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodGet {
		var articles []models.Artikel
		database.Preload("User").Order("created_at desc").Find(&articles)
		json.NewEncoder(w).Encode(articles)
		return
	}

	if r.Method == http.MethodPost {
		var art models.Artikel
		json.NewDecoder(r.Body).Decode(&art)
		art.UserID = user.ID
		database.Create(&art)
		json.NewEncoder(w).Encode(art)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func adminPengurusHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := adminUser(w, r)
	if !ok {
		return
	}
	if user.Role != "admin" {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var o models.Pengurus
		if err := database.Where("id = ?", id).First(&o).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			json.NewEncoder(w).Encode(o)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&o)
			database.Save(&o)
			json.NewEncoder(w).Encode(o)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&o)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodPost {
		var o models.Pengurus
		json.NewDecoder(r.Body).Decode(&o)
		if o.Status == "" {
			o.Status = "active"
		}
		database.Create(&o)
		json.NewEncoder(w).Encode(o)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func adminPendaftaranHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := adminUser(w, r)
	if !ok {
		return
	}
	if user.Role != "admin" {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var reg models.Pendaftaran
		if err := database.Where("id = ?", id).First(&reg).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&reg)
			database.Save(&reg)
			json.NewEncoder(w).Encode(reg)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&reg)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodGet {
		var regs []models.Pendaftaran
		database.Order("created_at desc").Find(&regs)
		json.NewEncoder(w).Encode(regs)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func adminActivitiesHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := adminUser(w, r)
	if !ok {
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var keg models.Kegiatan
		if err := database.Where("id = ?", id).First(&keg).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			json.NewEncoder(w).Encode(keg)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&keg)
			database.Save(&keg)
			json.NewEncoder(w).Encode(keg)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&keg)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodPost {
		var keg models.Kegiatan
		json.NewDecoder(r.Body).Decode(&keg)
		keg.UserID = user.ID
		database.Create(&keg)
		json.NewEncoder(w).Encode(keg)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func adminPesanHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := adminUser(w, r)
	if !ok {
		return
	}
	if user.Role != "admin" {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	database := db.GetDB()
	id := r.URL.Query().Get("id")

	if id != "" {
		var m models.Pesan
		if err := database.Where("id = ?", id).First(&m).Error; err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		if r.Method == http.MethodPut {
			json.NewDecoder(r.Body).Decode(&m)
			database.Save(&m)
			json.NewEncoder(w).Encode(m)
			return
		}

		if r.Method == http.MethodDelete {
			database.Delete(&m)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == http.MethodGet {
		var messages []models.Pesan
		database.Order("created_at desc").Find(&messages)
		json.NewEncoder(w).Encode(messages)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func adminSetupHandler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")
	if key != "setup_123" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	database := db.GetDB()

	database.AutoMigrate(
		&models.User{},
		&models.Artikel{},
		&models.Kegiatan{},
		&models.Pendaftaran{},
		&models.Pesan{},
		&models.Pengurus{},
	)

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	admin := models.User{
		Name:     "Admin Cakra",
		Email:    "admin@.cm",
		Password: string(hashedPassword),
		Role:     "admin",
	}
	database.Where(models.User{Email: "admin@.cm"}).Assign(models.User{Password: string(hashedPassword), Role: "admin"}).FirstOrCreate(&admin)

	hashedModPassword, _ := bcrypt.GenerateFromPassword([]byte("moderator123"), bcrypt.DefaultCost)
	mod := models.User{
		Name:     "Moderator Cakra",
		Email:    "moderator@.cm",
		Password: string(hashedModPassword),
		Role:     "moderator",
	}
	database.Where(models.User{Email: "moderator@.cm"}).Assign(models.User{Password: string(hashedModPassword), Role: "moderator"}).FirstOrCreate(&mod)

	database.FirstOrCreate(&models.Artikel{
		Judul:  "Mengenal Navigasi Darat",
		Slug:   "mengenal-navigasi-darat",
		UserID: admin.ID,
		Status: "published",
	}, models.Artikel{Slug: "mengenal-navigasi-darat"})

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"message":"Setup complete."}`)
}
