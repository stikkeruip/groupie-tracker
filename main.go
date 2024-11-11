package main

import (
	"groupie-tracker/handlers"
	"log"
	"net/http"
)

func main() {
	// Serve static files (images, CSS)
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Set up the handlers
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/api/locations", handlers.LocationsHandler)

	// Start the server
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
