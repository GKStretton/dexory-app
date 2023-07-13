package server

import (
	"encoding/csv"
	"fmt"
	"io"
	"sort"
	"strings"

	"github.com/gkstretton/dexory-app/backend/api"
)

// GenerateComparison generates a comparison between a machine scan report
// and a user's expectation
func GenerateComparison(
	machineReport []api.LocationScan,
	userCsv string,
) ([]api.LocationComparison, error) {
	// First, we build maps for the machine report and the user data
	// This will make it easier to compare the two datasets

	// location -> Scan result
	scanMap, err := getMachineScanMap(machineReport)
	if err != nil {
		return nil, err
	}

	// location -> []barcode
	expectedBarcodeMap, err := getExpectedBarcodeMap(userCsv)
	if err != nil {
		return nil, err
	}

	// Combine keys from both maps into a set of unique locations
	// This lets us handle cases where locations are entirely missing from
	// the scan or the user data.
	uniqueLocations := make(map[string]struct{})
	for location := range scanMap {
		uniqueLocations[location] = struct{}{}
	}
	for location := range expectedBarcodeMap {
		uniqueLocations[location] = struct{}{}
	}

	// The comparison object we will now build
	var comparison []api.LocationComparison

	for location := range uniqueLocations {
		scanReport, scanOk := scanMap[location]
		expectedBarcodes, barcodeOk := expectedBarcodeMap[location]

		// Work out an appropriate status
		status := api.NotScanned
		if scanOk {
			switch {
			case !scanReport.Scanned:
				status = api.NotScanned

			// Is scanned from now on
			case !scanReport.Occupied:
				if barcodeOk && len(expectedBarcodes) > 0 {
					status = api.EmptyButItShouldHaveBeenOccupied
				} else {
					status = api.EmptyAsExpected
				}

			// Is occupied from now on
			case len(scanReport.DetectedBarcodes) == 0:
				status = api.OccupiedButNoBarcodeCouldBeIdentified
			case !barcodeOk || len(expectedBarcodes) == 0:
				status = api.OccupiedByAnItemButShouldHaveBeenEmpty

			// Now just need to verify if occupied by the correct or wrong items
			default:
				if stringSlicesEqual(scanReport.DetectedBarcodes, expectedBarcodes) {
					status = api.OccupiedByTheExpectedItems
				} else {
					status = api.OccupiedByTheWrongItems
				}
			}
		}

		// build the comparison
		comp := api.LocationComparison{
			Name:   location,
			Status: status,
		}

		if scanReport != nil {
			comp.DetectedBarcodes = scanReport.DetectedBarcodes
			comp.Scanned = scanReport.Scanned
			comp.Occupied = scanReport.Occupied
		}

		if barcodeOk {
			comp.ExpectedBarcodes = expectedBarcodes
		} else {
			comp.ExpectedBarcodes = []string{}
		}

		comparison = append(comparison, comp)
	}

	// Now sort the comparisons slice by Location
	sort.Slice(comparison, func(i, j int) bool {
		return comparison[i].Name < comparison[j].Name
	})

	return comparison, nil
}

// getExpectedBarcodeMap parses the user's file and returns the information as
// a map of location to barcode slice
func getExpectedBarcodeMap(userCsv string) (map[string][]string, error) {
	reader := csv.NewReader(strings.NewReader(userCsv))

	// Skip header
	_, err := reader.Read()
	if err != nil {
		return nil, err
	}

	userMap := make(map[string][]string)
	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		location := line[0]
		barcode := line[1]

		// Ignore locations without barcodes, as there's no functional difference
		// between a location being omitted and it having no barcodes.
		if barcode == "" {
			continue
		}

		// append handles the key creation too
		userMap[location] = append(userMap[location], barcode)
	}

	return userMap, nil
}

// getMachineScanMap converts the machine scan report into a map for easy access
func getMachineScanMap(machineReport []api.LocationScan) (map[string]*api.LocationScan, error) {
	scanMap := make(map[string]*api.LocationScan)
	for i, scan := range machineReport {
		_, exists := scanMap[scan.Name]
		if exists {
			return nil, fmt.Errorf("duplicate machine scan for location '%s'", scan.Name)
		}
		scanMap[scan.Name] = &machineReport[i]
	}
	return scanMap, nil
}
