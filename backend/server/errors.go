package server

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func apiError(code int, msg string, args ...interface{}) error {
	err := fmt.Sprintf(msg, args...)
	fmt.Println(err)

	return echo.NewHTTPError(
		code,
		err,
	)
}

func notFound(msg string, args ...interface{}) error {
	return apiError(http.StatusNotFound, msg, args...)
}

func internalError(msg string, args ...interface{}) error {
	return apiError(http.StatusInternalServerError, msg, args...)
}

func badRequest(msg string, args ...interface{}) error {
	return apiError(http.StatusBadRequest, msg, args...)
}
