package main

import (
	"groupie-tracker/handlers"
	"log"
	"net/http"
)

func main() {
	// Serve static files (CSS, JavaScript, images) from the "static" directory
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static", fs)) // Serve files under /static/ without duplicating the "static" part in the URL path

	// Set up the route for the main index page
	http.HandleFunc("/", handlers.LandingHandler)

	// Set up the route for the main index page
	http.HandleFunc("/main", handlers.IndexHandler)

	// Start the HTTP server on localhost:8080
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe("localhost:8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
