package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/gkstretton/dexory-app/backend/api"
	"github.com/gkstretton/dexory-app/backend/server"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	port = flag.Int("port", 8080, "The port to serve the api on")
)

func main() {
	flag.Parse()
	fmt.Println("Launching backend")
	// This implements the api interface

	e := echo.New()

	// Allow CORS to simplfiy local dev and running.
	// Note: This app would be deployed behind a reverse proxy to ensure same-origin
	// if running in production
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:5000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
	}))

	api.RegisterHandlers(e, server.NewServer())
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", *port)))
}
