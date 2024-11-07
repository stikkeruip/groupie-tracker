package utils

import (
	"encoding/json"
	"io"
	"net/http"
)

// FetchData fetches JSON data from a URL and unmarshals it into the target interface.
// It automatically handles the "index" wrapper if present.
func FetchData(url string, target interface{}) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// Try to unmarshal into a map to check for "index" key
	var temp map[string]json.RawMessage
	if err := json.Unmarshal(body, &temp); err == nil {
		if indexData, ok := temp["index"]; ok {
			// Unmarshal the "index" key's value into the target
			if err := json.Unmarshal(indexData, target); err != nil {
				return err
			}
			return nil
		}
	}

	// If no "index" key, unmarshal the entire body into target
	if err := json.Unmarshal(body, target); err != nil {
		return err
	}

	return nil
}
