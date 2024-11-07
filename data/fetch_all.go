package data

import (
	"groupie-tracker/server/models"
	"groupie-tracker/utils"
)

func FetchAllData() (models.Indexes, error) {
	var indexes models.Indexes

	// Fetch Artists
	artistsURL := "https://groupietrackers.herokuapp.com/api/artists"
	if err := utils.FetchData(artistsURL, &indexes.Artists); err != nil {
		return indexes, err
	}

	// Fetch Locations
	locationsURL := "https://groupietrackers.herokuapp.com/api/locations"
	if err := utils.FetchData(locationsURL, &indexes.Locations); err != nil {
		return indexes, err
	}

	// Fetch Dates
	datesURL := "https://groupietrackers.herokuapp.com/api/dates"
	if err := utils.FetchData(datesURL, &indexes.Dates); err != nil {
		return indexes, err
	}

	// Fetch Relations
	relationsURL := "https://groupietrackers.herokuapp.com/api/relation"
	if err := utils.FetchData(relationsURL, &indexes.Relations); err != nil {
		return indexes, err
	}

	return indexes, nil
}
