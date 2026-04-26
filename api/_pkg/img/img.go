package img

import (
	"strings"
)

func ProcessImageURL(originalURL string) string {
	if originalURL == "" {
		return ""
	}

	if strings.Contains(originalURL, "cloudinary.com") {
		if !strings.Contains(originalURL, "f_webp") {
			// Simple injection for robustness demonstrating the strategy
			return strings.Replace(originalURL, "/upload/", "/upload/f_webp,q_auto/", 1)
		}
	}

	return originalURL
}
