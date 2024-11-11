package main

import (
	"groupie-tracker/data"
	"groupie-tracker/server/models"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

// Load the templates
var templates = template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))

// Render the homepage with artist data
func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Fetch the artists slice from the API
	artists, err := data.FetchInitialData()
	if err != nil {
		http.Error(w, "Failed to fetch artist data", http.StatusInternalServerError)
		return
	}

	// Wrap artists slice in PageData struct
	data := models.PageData{
		Artists: artists,
	}

	// Render template with wrapped data
	err = templates.ExecuteTemplate(w, "index.html", data)
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
