package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"cakra-manggala-api/api/_pkg/auth"
	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
	"golang.org/x/crypto/bcrypt"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(authHandler)))(w, r)
}

func authHandler(w http.ResponseWriter, r *http.Request) {
	switch routeSegment(r, "/api/auth") {
	case "login":
		loginHandler(w, r)
	case "me":
		meHandler(w, r)
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

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	database := db.GetDB()
	var user models.User
	if err := database.Where("email = ?", req.Email).First(&user).Error; err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email or password"})
		return
	}

	token, _ := auth.GenerateToken(user.ID)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := auth.ValidateToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	database := db.GetDB()
	var user models.User
	database.First(&user, claims.UserID)
	json.NewEncoder(w).Encode(user)
}
