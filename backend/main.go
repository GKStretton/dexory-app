package main

import (
	"flag"
	"fmt"

	"github.com/gkstretton/dexory-app/backend/api"
	"github.com/gkstretton/dexory-app/backend/server"
	"github.com/labstack/echo/v4"
)

var (
	port = flag.Int("port", 8080, "The port to serve the api on")
)

func main() {
	fmt.Println("Launching backend")
	// This implements the api interface

	e := echo.New()
	api.RegisterHandlers(e, server.NewServer())
	e.Logger.Fatal(e.Start(fmt.Sprintf("localhost:%d", *port)))
}
