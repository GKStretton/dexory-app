package server

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gkstretton/dexory-app/backend/api"
	"github.com/gkstretton/dexory-app/backend/storage"
	"github.com/labstack/echo/v4"
)

type Server struct {
	store storage.Storage
}

// Generate comparison from the given machine report name and this user report
// (POST /generate-comparison)
func (s *Server) PostGenerateComparison(ctx echo.Context, params api.PostGenerateComparisonParams) error {
	fmt.Printf("Generating comparison for %s and provided csv...\n", params.MachineReportName)

	defer ctx.Request().Body.Close()
	b, err := io.ReadAll(ctx.Request().Body)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	fmt.Println(string(b))
	// todo: csv.NewReader, build a map location->barcode
	// todo: then, load the param report
	// todo: then, build the comparison

	return internalError("not implemented")
}

// Get the list of machine reports
// (GET /machine-reports)
func (s *Server) GetMachineReports(ctx echo.Context) error {
	reports, err := s.store.ListMachineReports()
	if err != nil {
		return internalError("failed to get reports: %v", err)
	}

	fmt.Println("Returning reports list")
	return ctx.JSON(http.StatusOK, reports)
}

// Uploads a new machine report
// (POST /machine-reports)
func (s *Server) PostMachineReports(ctx echo.Context) error {
	var report []api.LocationScan
	err := ctx.Bind(&report)
	if err != nil {
		return badRequest("failed to bind body as MachineReport: %v", err)
	}

	// filesystem-safe name
	name := time.Now().Format("2006-01-02_15-04-05")
	err = s.store.SaveMachineReport(name, report)
	if err != nil {
		return internalError("failed to save report: %v", err)
	}

	fmt.Println("Saved report")
	return ctx.NoContent(http.StatusCreated)
}

func NewServer() *Server {
	return &Server{
		store: storage.CreateStorage(),
	}
}
