package main

import (
	"fmt"
	"groupie-tracker/data"
)

func main() {
	indexes, err := data.FetchAllData()
	if err != nil {
		fmt.Println("Error fetching data:", err)
		return
	}

	// Access Artists
	for _, artist := range indexes.Artists {
		fmt.Printf("Artist ID: %d, Name: %s, Creation Date: %d, First Album: %s, Members: %v\n", artist.ID, artist.Name, artist.CreationDate, artist.FirstAlbum, artist.Members)
	}

	// Access Locations
	for _, location := range indexes.Locations {
		fmt.Printf("Location ID: %d, Locations: %v\n", location.ID, location.Locations)
	}

	// Access Dates
	for _, date := range indexes.Dates {
		fmt.Printf("Date ID: %d, Dates: %v\n", date.ID, date.Dates)
	}

	// Access Relations
	for _, relation := range indexes.Relations {
		fmt.Printf("Relation ID: %d, DatesLocations: %v\n", relation.ID, relation.DatesLocations)
	}
}
