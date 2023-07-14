## Example output

See `example_output/` in this repo for the text-based and visual comparison reports on the example data

## Instructions for running

1. `docker-compose up --build` from the root dir.
2. Navigate to [http://localhost:5000](http://localhost:5000)
3. To add a machine report, send a POST to [localhost:8080/machine-reports](localhost:8080/machine-reports) with the JSON as the body of the request.

To run for development:

1. Backend: `cd backend && go run . -storagePath ../storage`
2. Frontend: `cd frontend && npm install && npm start`

And generate the client and server api libraries with `./build-api`

## Tech stack

- Docker, docker-compose
- OpenAPI + client & server generators
- Go, Echo
- React, Typescript, Material-ui

## Frontend

Basic frontend layout taken from [here](https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard) for speed.

- Uses Material UI component library
- Api client library generated from the openapi spec with https://github.com/OpenAPITools/openapi-generator-cli. (Note: ./build-api requires Java JRE installed because the openapi generator uses java

## Backend

The backend is written in Go with the Echo router framework. I opted for filestorage rather than a database to keep it simple, but made a storage interface to maintain OCP.

- Go API server stubs are generated from the openapi spec with https://github.com/deepmap/oapi-codegen

You can view the api with your own swagger renderer or at this link: [https://petstore.swagger.io/?url=https://raw.githubusercontent.com/GKStretton/dexory-app/main/openapi.yml](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/GKStretton/dexory-app/main/openapi.yml)

There are two unit tests for the critical functionalities in server/:

- TestStringSlicesEqual
- TestGenerateComparison

## Deployment notes

The app consists of two containers, with docker-compose coordinating. This makes it easy to deploy in future. Note, cors has been enabled for testing purposes so the frontend can talk to the backend on different port (different origin). For an actually deployment, both would be behind a reverse proxy so the frontend and api have the same origin.

## Improvements

- If I were to do this again, I would ask for clarification on how, and by who/what, the report will be used. The raw report format is hard to interpret by a human because it's flat, this is what I would suggest if it's to be ingested by humans:

  1.  Get confirmation that the location codes map how I assumed `{rack}{position}{shelf}`.
  2.  Incorporate location awareness into the backend report generator, moving the location organising code out of the frontend and into the backend. This would improve the frontend responsiveness.
  3.  The generated json reports would then have location-based hierarchy, so they are easier to interpret by a human.
  4.  The status summaries could be included in the json report too.

- The frontend hangs for a short time when a report is generated due to the client-side transformation. Making the report be organised by location would eliminate this.
- The frontend visualisation is currently not robust to missing shelves / positions, so the imagery may become misleading if there are missing elements
- The frontend is not particularly responsive, if I had more time I would optimise for smaller windows and mobile devices, for example by making the location visualisation scroll instead of wrap.

## License

This work is released under the CC0 1.0 Universal Public Domain Dedication. You can find the full text of the license here: https://creativecommons.org/publicdomain/zero/1.0/

### Polite Request for Attribution

While it's not legally required, we kindly ask that you give credit if you use or modify this work. Attribution helps support the project and encourages future learning and contributions. You can provide credit by linking to this repository or mentioning the original author's name. Thank you for your cooperation!
