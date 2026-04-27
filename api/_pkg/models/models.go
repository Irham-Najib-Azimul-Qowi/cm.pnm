package models

import (
	"github.com/google/uuid"
	"time"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name      string    `json:"name"`
	Email     string    `gorm:"uniqueIndex" json:"email"`
	Password  string    `json:"-"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Artikel struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Judul       string    `json:"judul"`
	Slug        string    `gorm:"uniqueIndex" json:"slug"`
	Excerpt     string    `json:"excerpt"`
	Konten      string    `json:"konten"`
	GambarUtama string    `json:"gambar_utama"`
	Status      string    `json:"status"`
	Views       int       `gorm:"default:0" json:"views"`
	UserID      uuid.UUID `gorm:"type:uuid" json:"user_id"`
	User        User      `json:"user"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Kegiatan struct {
	ID                 uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	JudulKegiatan      string    `json:"judul_kegiatan"`
	Tahun              int       `json:"tahun"`
	TanggalPelaksanaan time.Time `json:"tanggal_pelaksanaan"`
	Materi             string    `json:"materi"`
	Tempat             string    `json:"tempat"`
	KapelPJ            string    `json:"kapel_pj"`
	Sifat              string    `json:"sifat"`
	GambarUtama        string    `json:"gambar_utama"`
	UserID             uuid.UUID `gorm:"type:uuid" json:"user_id"`
	User               User      `json:"user"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Pendaftaran struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	NamaLengkap  string    `json:"nama_lengkap"`
	NIM          string    `json:"nim"`
	Jurusan      string    `json:"jurusan"`
	ProgramStudi string    `json:"program_studi"`
	NoHP         string    `json:"no_hp"`
	Status       string    `json:"status"`
	IsApproved   bool      `json:"is_approved"`
	CreatedAt    time.Time `json:"created_at"`
}

type Pesan struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Nama      string    `json:"nama"`
	Email     string    `json:"email"`
	Subjek    string    `json:"subjek"`
	Pesan     string    `json:"pesan"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}

type Pengurus struct {
	ID      uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Nama    string    `json:"nama"`
	Jabatan string    `json:"jabatan"`
	Foto    string    `json:"foto"`
	Urutan  int       `json:"urutan"`
}
