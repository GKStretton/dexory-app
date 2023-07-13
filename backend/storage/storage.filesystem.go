package storage

import (
	"encoding/json"
	"flag"
	"os"
	"path/filepath"
	"strings"

	"github.com/gkstretton/dexory-app/backend/api"
)

var (
	storagePath = flag.String("storagePath", "/storage", "the base path for storage")
)

const machineFolder = "machine"

type FileStorage struct{}

func (f *FileStorage) ListMachineReports() ([]string, error) {
	files, err := os.ReadDir(getMachineReportsDir())
	if err != nil {
		return nil, err
	}

	reportList := []string{}
	for _, f := range files {
		reportList = append(reportList, getFileNameWithoutExt(f.Name()))
	}

	return reportList, nil
}

func (f *FileStorage) GetMachineReport(name string) ([]api.LocationScan, error) {
	data, err := os.ReadFile(getMachineReportPath(name))
	if err != nil {
		return nil, err
	}

	var report []api.LocationScan
	err = json.Unmarshal(data, &report)
	if err != nil {
		return nil, err
	}

	return report, nil
}

func (f *FileStorage) SaveMachineReport(name string, report []api.LocationScan) error {
	data, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return err
	}

	err = os.WriteFile(getMachineReportPath(name), data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func getMachineReportsDir() string {
	return filepath.Join(*storagePath, machineFolder)
}

func getMachineReportPath(name string) string {
	return filepath.Join(getMachineReportsDir(), name+".json")
}

func getFileNameWithoutExt(name string) string {
	return strings.TrimSuffix(filepath.Base(name), filepath.Ext(name))
}
