package server

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func internalError(msg string, args ...interface{}) error {
	return echo.NewHTTPError(
		http.StatusInternalServerError,
		fmt.Sprintf(msg, args...),
	)
}
