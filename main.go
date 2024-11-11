package main

import (
	"groupie-tracker/data"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

// Load the templates
var templates = template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))

// Render the homepage with artist data
func indexHandler(w http.ResponseWriter, r *http.Request) {
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

func main() {
	// Serve static files (images, CSS)
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Set up the main handler
	http.HandleFunc("/", indexHandler)

	// Start the server
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
