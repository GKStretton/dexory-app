## Instructions for running

1. `docker-compose up --build` from the root dir.
2. Navigate to [http://localhost:5000](http://localhost:5000)
3. To add a machine report, send a POST to [localhost:8080/machine-reports](localhost:8080/machine-reports) with the JSON as the body of the request.

To run for development:

1. Backend: `cd backend && go run . -storagePath ../storage`
2. Frontend: `cd frontend && npm install && npm start`

And generate the client and server api libraries with `./build-api`

## Frontend

Basic frontend layout taken from [here](https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard) for speed.

- Uses Material UI component library
- Api client library generated from the openapi spec with https://github.com/OpenAPITools/openapi-generator-cli. (Note: ./build-api requires Java JRE installed because the openapi generator uses java

## Backend

The backend is written in Go with the Echo router framework. I opted for filestorage rather than a database to keep it simple, but made a storage interface to maintain OCP.

- Go API server stubs are generated from the openapi spec with https://github.com/deepmap/oapi-codegen

You can view the api with your own swagger renderer or at this link: [https://petstore.swagger.io/?url=https://raw.githubusercontent.com/GKStretton/dexory-app/main/openapi.yml](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/GKStretton/dexory-app/main/openapi.yml)

## Deployment notes

The app consists of two containers, with docker-compose coordinating. This makes it easy to deploy in future. Note, cors has been enabled for testing purposes so the frontend can talk to the backend on different port (different origin). For an actually deployment, both would be behind a reverse proxy so the frontend and api have the same origin.

## Improvements

- The frontend visualisation is currently not robust to missing shelves / positions, so the imagery may become misleading if there are missing elements
- The frontend hangs for a short time when a report is generated, some optimisation could be done here
- The frontend is not particularly responsive, if I had more time I would optimise for non-"1080p landscape".

## License

This work is released under the CC0 1.0 Universal Public Domain Dedication. You can find the full text of the license here: https://creativecommons.org/publicdomain/zero/1.0/

### Polite Request for Attribution

While it's not legally required, we kindly ask that you give credit if you use or modify this work. Attribution helps support the project and encourages future learning and contributions. You can provide credit by linking to this repository or mentioning the original author's name. Thank you for your cooperation!
