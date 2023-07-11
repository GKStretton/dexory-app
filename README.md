## Frontend

Basic frontend layout taken from [here](https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard) for speed.

- Uses Material UI component library
- Api client library generated from the openapi spec with https://github.com/OpenAPITools/openapi-generator-cli. (Note: ./build-api requires Java JRE installed because the openapi generator uses java

## Backend

The backend is written in Go as this is what I am most familiar with and could set up fastest. I also considered using something like Supabase, which I'd like to use at some point in future, to save writing the CRUD, but didn't want to risk a rabbit hole given my limited time right now.

- Go API server stubs are generated from the openapi spec with https://github.com/deepmap/oapi-codegen

## License

This work is released under the CC0 1.0 Universal Public Domain Dedication. You can find the full text of the license here: https://creativecommons.org/publicdomain/zero/1.0/

### Polite Request for Attribution

While it's not legally required, we kindly ask that you give credit if you use or modify this work. Attribution helps support the project and encourages future learning and contributions. You can provide credit by linking to this repository or mentioning the original author's name. Thank you for your cooperation!
