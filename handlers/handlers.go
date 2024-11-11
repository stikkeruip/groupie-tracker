package handlers

import (
	"encoding/json"
	"groupie-tracker/data"
	"html/template"
	"net/http"
	"path/filepath"
	"strconv"
)

// Load the templates
var templates = template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))

// IndexHandler renders the homepage with artist data
func IndexHandler(w http.ResponseWriter, r *http.Request) {
	// Fetch all data
	indexes, err := data.FetchInitialData()
	if err != nil {
		http.Error(w, "Failed to fetch artist data", http.StatusInternalServerError)
		return
	}

	// Render template with fetched data
	err = templates.ExecuteTemplate(w, "index.html", indexes)
	if err != nil {
		http.Error(w, "Failed to render template", http.StatusInternalServerError)
	}
}

// LocationsHandler handles locations data request
func LocationsHandler(w http.ResponseWriter, r *http.Request) {
	// Get artist ID from query parameter
	artistID := r.URL.Query().Get("id")
	if artistID == "" {
		http.Error(w, "Artist ID is required", http.StatusBadRequest)
		return
	}

	// Convert ID to int
	id, err := strconv.Atoi(artistID)
	if err != nil {
		http.Error(w, "Invalid artist ID", http.StatusBadRequest)
		return
	}

	// Fetch locations
	locations, err := data.FetchLocationsSlice(id)
	if err != nil {
		http.Error(w, "Failed to fetch locations", http.StatusInternalServerError)
		return
	}

	// Set content type and encode response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(locations)
}
