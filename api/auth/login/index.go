package handler

import (
	"encoding/json"
	"net/http"

	"cakra-manggala-api/api/_pkg/auth"
	"cakra-manggala-api/api/_pkg/db"
	"cakra-manggala-api/api/_pkg/middleware"
	"cakra-manggala-api/api/_pkg/models"
	"golang.org/x/crypto/bcrypt"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Recover(middleware.CORS(middleware.JSONResponse(loginHandler)))(w, r)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	database := db.GetDB()
	var user models.User

	result := database.Where("email = ?", req.Email).First(&user)
	if result.Error != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email or password"})
		return
	}

	token, err := auth.GenerateToken(user.ID, user.Role)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Could not generate token"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user":  user,
	})
}
