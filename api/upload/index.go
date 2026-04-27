package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

// Response struct dari Vercel Blob
type BlobResponse struct {
	Url string `json:"url"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// Set header response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// 1. Ambil token blob dari environment (wajib ada)
	token := os.Getenv("BLOB_READ_WRITE_TOKEN")
	if token == "" {
		http.Error(w, `{"error": "BLOB_READ_WRITE_TOKEN belum disetting"}`, http.StatusInternalServerError)
		return
	}

	// 2. Parse Multipart Form (Maksimal 10 MB)
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Gagal membaca form upload max 10MB"})
		return
	}

	// 3. Ambil file `gambar` atau `file`
	file, fileHeader, err := r.FormFile("gambar")
	if err != nil {
		file, fileHeader, err = r.FormFile("file") // Coba key "file" juga
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Key gambar tidak ditemukan"})
			return
		}
	}
	defer file.Close()

	// 4. Baca buffer gambar
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, `{"error": "Gagal membaca file buffer"}`, http.StatusInternalServerError)
		return
	}

	// 5. Buat nama file yang unik untuk menghindari penumpukan/tumpuk nama sama (overwrite)
	ext := filepath.Ext(fileHeader.Filename)
	uniqueFilename := fmt.Sprintf("%d-%s%s", time.Now().Unix(), uuid.New().String()[:8], ext)

	// 6. Siapkan Permintaan (Request) Vercel Blob REST API
	uploadURL := fmt.Sprintf("https://blob.vercel-storage.com/%s", uniqueFilename)

	req, err := http.NewRequest("PUT", uploadURL, bytes.NewBuffer(fileBytes))
	if err != nil {
		http.Error(w, `{"error": "Gagal inisiasi request ke Vercel"}`, http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Bearer "+token)
	// Default Content-Type mengikuti jenis gambar atau octet-stream
	req.Header.Set("Content-Type", fileHeader.Header.Get("Content-Type"))

	// Eksekusi HTTP Client
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error requesting to Blob: %v\n", err)
		http.Error(w, `{"error": "Gagal request POST Vercel Blob"}`, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyError, _ := io.ReadAll(resp.Body)
		fmt.Printf("Vercel Blob Reject: %s\n", string(bodyError))
		http.Error(w, `{"error": "Ups, Vercel Blob menolak file Anda"}`, resp.StatusCode)
		return
	}

	// 7. Ambil Result & Balas ke React Frontend
	var blobResp BlobResponse
	if err := json.NewDecoder(resp.Body).Decode(&blobResp); err != nil {
		http.Error(w, `{"error": "Gagal membaca balasan vercel blob"}`, http.StatusInternalServerError)
		return
	}

	// Selesai! Berikan URL publik yang didapat ke front-end
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"url":     blobResp.Url,
		"message": "Upload sukses!",
	})
}
