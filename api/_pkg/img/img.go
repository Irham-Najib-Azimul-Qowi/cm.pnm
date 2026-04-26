package img

import (
	"fmt"
	"net/http"
	"strings"
)

// ProcessImageURL handles image logic. 
// In a production Go environment (with CGO), we would use a library like 'github.com/chai2010/webp'
// to convert the image to WebP format. 
// For serverless/Vercel (which often lacks CGO/libwebp in the build container), 
// the robust choice is using a Cloud Media API (like Cloudinary or Imgix) 
// or an external Go binary.
func ProcessImageURL(originalURL string) string {
	if originalURL == "" {
		return ""
	}

	// For optimization, we can append transformations if using a CDN
	// Example for Cloudinary: originalURL + "/f_webp,q_auto"
	if strings.Contains(originalURL, "cloudinary.com") {
		return originalURL + "?f=webp&q=auto"
	}

	return originalURL
}

// ValidateImage checks if the URL looks like a valid image
func ValidateImage(url string) bool {
	validExtensions := []string{".jpg", ".jpeg", ".png", ".webp", ".gif"}
	lowerURL := strings.ToLower(url)
	for _, ext := range validExtensions {
		if strings.HasSuffix(lowerURL, ext) {
			return true
		}
	}
	return false
}

// Handler abstraction for image proxy if needed (for robustness)
func ProxyHandler(w http.ResponseWriter, r *http.Request) {
	// Robust error handling and proxying logic would go here
	fmt.Fprintf(w, "Image Proxy Active")
}
