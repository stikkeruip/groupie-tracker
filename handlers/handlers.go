package handlers

import (
	"groupie-tracker/data"
	"html/template"
	"net/http"
	"path/filepath"
	"strings"
)

// FormatLocation formats a location string by replacing underscores and hyphens
func FormatLocation(location string) string {
	// Replace underscores with spaces
	location = strings.ReplaceAll(location, "_", " ")
	// Replace hyphens with commas and spaces
	location = strings.ReplaceAll(location, "-", ", ")
	// Capitalize first letter of each word
	words := strings.Fields(location)
	for i, word := range words {
		words[i] = strings.ToUpper(string(word[0])) + strings.ToLower(word[1:])
	}
	return strings.Join(words, " ")
}

// Create template functions map
var funcMap = template.FuncMap{
	"FormatLocation": FormatLocation,
}

// Load the templates with function map
var templates = template.Must(template.New("").Funcs(funcMap).ParseFiles(filepath.Join("templates", "index.html")))

// IndexHandler renders the homepage with artist data
func IndexHandler(w http.ResponseWriter, r *http.Request) {
	// Fetch all data
	indexes, err := data.FetchAllData()
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
