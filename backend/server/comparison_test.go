package server

import (
	"fmt"
	"testing"

	"github.com/gkstretton/dexory-app/backend/api"
	"github.com/stretchr/testify/assert"
)

type userEntry struct {
	location string
	barcodes []string
}

type testCase struct {
	machine        *api.LocationScan
	user           *userEntry
	expectedStatus api.LocationComparisonStatus
}

func addToCSV(csv, location, item string) string {
	return fmt.Sprintf("%s%s,%s\n", csv, location, item)
}

// Build the test cases
func buildTestData() map[string]testCase {
	testData := make(map[string]testCase)

	var loc string
	// not scanned
	loc = "ZA000A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          false,
			Occupied:         false,
			DetectedBarcodes: []string{},
		},
		user: &userEntry{
			location: loc,
		},
		expectedStatus: api.NotScanned,
	}

	// empty as expected
	loc = "ZA001A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          true,
			Occupied:         false,
			DetectedBarcodes: []string{},
		},
		user: &userEntry{
			location: loc,
		},
		expectedStatus: api.EmptyAsExpected,
	}

	// empty, but should have been occupied
	loc = "ZA003A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          true,
			Occupied:         false,
			DetectedBarcodes: []string{},
		},
		user: &userEntry{
			location: loc,
			barcodes: []string{"xyz"},
		},
		expectedStatus: api.EmptyButItShouldHaveBeenOccupied,
	}

	// occupied by expected items
	loc = "ZA004A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          true,
			Occupied:         true,
			DetectedBarcodes: []string{"xy"},
		},
		user: &userEntry{
			location: loc,
			barcodes: []string{"xy"},
		},
		expectedStatus: api.OccupiedByTheExpectedItems,
	}

	// occupied by the wrong items
	loc = "ZA005A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          true,
			Occupied:         true,
			DetectedBarcodes: []string{"abc"},
		},
		user: &userEntry{
			location: loc,
			barcodes: []string{"xyzz"},
		},
		expectedStatus: api.OccupiedByTheWrongItems,
	}

	// occupied but should have been empty
	loc = "ZA006A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          true,
			Occupied:         true,
			DetectedBarcodes: []string{"abc"},
		},
		user: &userEntry{
			location: loc,
		},
		expectedStatus: api.OccupiedByAnItemButShouldHaveBeenEmpty,
	}

	// occupied but no barcode identified
	loc = "ZA007A"
	testData[loc] = testCase{
		machine: &api.LocationScan{
			Name:             loc,
			Scanned:          true,
			Occupied:         true,
			DetectedBarcodes: []string{},
		},
		user: &userEntry{
			location: loc,
		},
		expectedStatus: api.OccupiedButNoBarcodeCouldBeIdentified,
	}
	return testData
}

/*
Execute the tests for this function
The strategy employed is to generate test cases for each status, covering
a range of options, and a comparison report is generated from this data.

Then, the comparison report is ensured to be consistent with the test cases
- All relevant locaitons are present
- Basic information is correct
- Statuses are as expected
- Statuses make sense
*/
func TestGenerateComparison(t *testing.T) {
	// Construct test cases
	testData := buildTestData()

	// build correct format for test data
	machineReport := []api.LocationScan{}
	userCsv := "LOCATION,ITEM\n"
	for _, tc := range testData {
		if tc.machine != nil {
			machineReport = append(machineReport, *tc.machine)
		}
		if tc.user != nil {
			for _, barcode := range tc.user.barcodes {
				userCsv = addToCSV(userCsv, tc.user.location, barcode)
			}
		}
	}

	// Call the function being tested, the comparison generator
	comparison, err := GenerateComparison(machineReport, userCsv)
	assert.NoError(t, err)

	// Ensure number of comparisons is equal to number of test cases
	assert.EqualValues(t, len(comparison), len(testData))

	// Build a map from the comparison data to make checking the test cases easier
	comparisonMap := make(map[string]api.LocationComparison)
	for _, c := range comparison {
		_, exists := comparisonMap[c.Name]
		// There should not be duplicates
		assert.False(t, exists)

		comparisonMap[c.Name] = c
	}

	// For every test case
	for _, tc := range testData {
		t.Run(tc.machine.Name, func(t *testing.T) {

			location := tc.machine.Name

			// Get corresponding comparison
			comparisonReport, exists := comparisonMap[location]
			assert.True(t, exists)

			// Ensure core information is correct
			assert.True(t,
				stringSlicesEqual(
					comparisonReport.DetectedBarcodes,
					tc.machine.DetectedBarcodes,
				),
			)
			assert.True(t,
				stringSlicesEqual(
					comparisonReport.ExpectedBarcodes,
					tc.user.barcodes,
				),
			)
			assert.Equal(t, tc.machine.Occupied, comparisonReport.Occupied)
			assert.Equal(t, tc.machine.Scanned, comparisonReport.Scanned)

			// Verify that the status is expected
			assert.Equal(t, tc.expectedStatus, comparisonReport.Status)

			// Verify that the status is appropriate
			switch comparisonReport.Status {
			case api.NotScanned:
				if tc.machine != nil {
					assert.False(t, tc.machine.Scanned)
				}
			case api.EmptyAsExpected:
				assert.True(t, tc.machine.Scanned)
				assert.False(t, tc.machine.Occupied)
				assert.Len(t, tc.machine.DetectedBarcodes, 0)
				assert.Len(t, tc.user.barcodes, 0)
			case api.EmptyButItShouldHaveBeenOccupied:
				assert.True(t, tc.machine.Scanned)
				assert.False(t, tc.machine.Occupied)
				assert.Len(t, tc.machine.DetectedBarcodes, 0)
				assert.Greater(t, len(tc.user.barcodes), 0)
			case api.OccupiedByTheExpectedItems:
				assert.True(t, tc.machine.Scanned)
				assert.True(t, tc.machine.Occupied)
				assert.True(t,
					stringSlicesEqual(
						tc.machine.DetectedBarcodes,
						tc.user.barcodes,
					),
				)
			case api.OccupiedByTheWrongItems:
				assert.True(t, tc.machine.Scanned)
				assert.True(t, tc.machine.Occupied)
				assert.False(t,
					stringSlicesEqual(
						tc.machine.DetectedBarcodes,
						tc.user.barcodes,
					),
				)
			case api.OccupiedByAnItemButShouldHaveBeenEmpty:
				assert.True(t, tc.machine.Scanned)
				assert.True(t, tc.machine.Occupied)
				assert.Len(t, tc.user.barcodes, 0)
			case api.OccupiedButNoBarcodeCouldBeIdentified:
				assert.True(t, tc.machine.Scanned)
				assert.True(t, tc.machine.Occupied)
				assert.Len(t, tc.machine.DetectedBarcodes, 0)
			}
		})
	}
}
