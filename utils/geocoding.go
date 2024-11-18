package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Struct to hold the Geocoding API response
type CoordinatesResponse struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

func GetCoordinates(address string) (*CoordinatesResponse, error) {
	// Your API key here
	apiKey := "AIzaSyD2AbAIDg-FLpmw_3T_mLCWXr0sP6tnOdU"

	// Create the URL for the API request
	url := fmt.Sprintf("https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s", address, apiKey)

	// Make the HTTP GET request
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	// Parse the JSON response into a map
	var jsonResponse map[string]interface{}
	if err := json.Unmarshal(body, &jsonResponse); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	// Extract results
	results, ok := jsonResponse["results"].([]interface{})
	if !ok || len(results) == 0 {
		return nil, fmt.Errorf("no results found for the address")
	}

	// Extract location from the first result
	firstResult := results[0].(map[string]interface{})
	geometry := firstResult["geometry"].(map[string]interface{})
	location := geometry["location"].(map[string]interface{})

	lat, latOk := location["lat"].(float64)
	lng, lngOk := location["lng"].(float64)
	if !latOk || !lngOk {
		return nil, fmt.Errorf("failed to extract latitude and longitude")
	}

	return &CoordinatesResponse{Lat: lat, Lng: lng}, nil
}
