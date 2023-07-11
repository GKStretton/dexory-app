package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Server struct {
}

func (s *Server) GetTest(ctx echo.Context) error {
	ctx.JSON(http.StatusOK, 5)
	return nil
}

func NewServer() *Server {
	return &Server{}
}
