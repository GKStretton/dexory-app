package storage

import "github.com/gkstretton/dexory-app/backend/api"

type Storage interface {
	ListMachineReports() ([]string, error)
	GetMachineReport(name string) ([]api.LocationScan, error)
	SaveMachineReport(name string, report []api.LocationScan) error
}

func CreateStorage() Storage {
	return &FileStorage{}
}
