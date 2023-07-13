package server

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func internalError(msg string, args ...interface{}) error {
	err := fmt.Sprintf(msg, args...)
	fmt.Println(err)

	return echo.NewHTTPError(
		http.StatusInternalServerError,
		err,
	)
}

func badRequest(msg string, args ...interface{}) error {
	err := fmt.Sprintf(msg, args...)
	fmt.Println(err)

	return echo.NewHTTPError(
		http.StatusBadRequest,
		err,
	)
}
