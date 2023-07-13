package server

import (
	"fmt"
	"io"
	"net/http"
	"strings"
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

	machineReport, err := s.store.GetMachineReport(params.MachineReportName)
	if err != nil {
		return notFound("couldn't load report '%s': %v", params.MachineReportName, err)
	}

	data, err := io.ReadAll(ctx.Request().Body)
	defer ctx.Request().Body.Close()
	if err != nil {
		return badRequest("failed to read csv body: %v", err)
	}

	// some '"' were at start and end of body
	csvString := strings.ReplaceAll(string(data), "\"", "")
	// "\n" comes through literally
	csvString = strings.ReplaceAll(csvString, `\n`, "\n")

	comparison, err := GenerateComparison(machineReport, csvString)
	if err != nil {
		return internalError("failed to generate comparison: %v", err)
	}

	return ctx.JSON(200, comparison)
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
