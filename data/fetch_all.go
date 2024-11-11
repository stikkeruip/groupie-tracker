package data

import (
	"fmt"
	"groupie-tracker/server/models"
	"groupie-tracker/utils"
)

func FetchInitialData() ([]models.Artist, error) {
	var artists []models.Artist

	// Fetch Artists
	artistsURL := "https://groupietrackers.herokuapp.com/api/artists"
	if err := utils.FetchData(artistsURL, &artists); err != nil {
		return nil, err
	}

	return artists, nil
}

func FetchLocationsSlice(artistID int) ([]string, error) {
	// Construct the URL with the artist's ID
	locationsURL := fmt.Sprintf("https://groupietrackers.herokuapp.com/api/locations/%d", artistID)

	// Create a variable to hold the response
	var locResp models.Locations

	// Use FetchData to get and decode the data
	if err := utils.FetchData(locationsURL, &locResp); err != nil {
		return nil, err
	}

	return locResp.Locations, nil
}
