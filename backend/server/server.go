package server

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gkstretton/dexory-app/backend/api"
	"github.com/labstack/echo/v4"
)

type Server struct {
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

	return echo.NewHTTPError(http.StatusBadRequest, "not implemented")
}

// Get the list of machine reports
// (GET /machine-reports)
func (s *Server) GetMachineReports(ctx echo.Context) error {
	// todo: get from storage, return
	return internalError("not implemented")
}

// Uploads a new machine report
// (POST /machine-reports)
func (s *Server) PostMachineReports(ctx echo.Context) error {
	defer ctx.Request().Body.Close()
	data, err := io.ReadAll(ctx.Request().Body)
	if err != nil {
		return internalError("failed to read body: %v", err)
	}

	fmt.Println(string(data))
	// todo: call save to storage

	return internalError("not implemented")
}

func NewServer() *Server {
	return &Server{}
}
