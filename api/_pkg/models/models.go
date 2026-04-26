package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string         `json:"name"`
	Email     string         `gorm:"uniqueIndex" json:"email"`
	Password  string         `json:"-"`
	Role      string         `gorm:"default:moderator" json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}

type Artikel struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Judul       string         `json:"judul"`
	Slug        string         `gorm:"uniqueIndex" json:"slug"`
	Excerpt     string         `json:"excerpt"`
	Konten      string         `gorm:"type:text" json:"konten"`
	GambarUtama string         `json:"gambar_utama"`
	Status      string         `gorm:"default:draft" json:"status"`
	UserID      uuid.UUID      `gorm:"type:uuid" json:"user_id"`
	Views       int            `gorm:"default:0" json:"views"`
	User        User           `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (a *Artikel) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return
}

type Kegiatan struct {
	ID                 uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Tahun              int            `json:"tahun"`
	JudulKegiatan      string         `json:"judul_kegiatan"`
	TanggalPelaksanaan time.Time      `json:"tanggal_pelaksanaan"`
	Materi             string         `gorm:"type:text" json:"materi"`
	Tempat             string         `json:"tempat"`
	KapelPJ            string         `json:"kapel_pj"`
	Sifat              string         `json:"sifat"` // internal, eksternal
	GambarUtama        string         `json:"gambar_utama"`
	UserID             uuid.UUID      `gorm:"type:uuid" json:"user_id"`
	User               User           `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`
}

func (k *Kegiatan) BeforeCreate(tx *gorm.DB) (err error) {
	if k.ID == uuid.Nil {
		k.ID = uuid.New()
	}
	return
}

type Pendaftaran struct {
	ID                         uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	NamaLengkap               string         `json:"nama_lengkap"`
	NIM                        string         `gorm:"uniqueIndex" json:"nim"`
	Jurusan                    string         `json:"jurusan"`
	ProgramStudi              string         `json:"program_studi"`
	JenisKelamin              string         `json:"jenis_kelamin"`
	TempatLahir               string         `json:"tempat_lahir"`
	TanggalLahir              time.Time      `json:"tanggal_lahir"`
	NoHP                       string         `json:"no_hp"`
	Alamat                     string         `gorm:"type:text" json:"alamat"`
	OrganisasiYangPernahDiikuti string         `gorm:"type:text" json:"organisasi_yang_pernah_diikuti"`
	AlasanBergabung           string         `gorm:"type:text" json:"alasan_bergabung"`
	FotoDiri                  string         `json:"foto_diri"`
	Status                     string         `gorm:"default:pending" json:"status"`
	IsApproved                bool           `gorm:"default:false" json:"is_approved"`
	CreatedAt                  time.Time      `json:"created_at"`
	UpdatedAt                  time.Time      `json:"updated_at"`
	DeletedAt                  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *Pendaftaran) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}

type Pesan struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Nama      string         `json:"nama"`
	Email     string         `json:"email"`
	Subjek    string         `json:"subjek"`
	Pesan     string         `gorm:"type:text" json:"pesan"`
	IsRead    bool           `gorm:"default:false" json:"is_read"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *Pesan) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}

type Pengurus struct {
	ID             uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Nama           string         `json:"nama"`
	Jabatan        string         `json:"jabatan"`
	ProdiSemester  string         `json:"prodi_semester"`
	InstagramURL   string         `json:"instagram_url"`
	Foto           string         `json:"foto"`
	Urutan         int            `gorm:"default:0" json:"urutan"`
	Status         string         `gorm:"default:active" json:"status"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *Pengurus) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}
