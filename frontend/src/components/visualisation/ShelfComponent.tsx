import { Box, Divider, Grid, Typography } from "@mui/material";
import { LocationComparison } from "../../api";
import LocationComponent from "./LocationComponent";

interface ShelfProps {
  shelf: Record<number, LocationComparison>;
  shelfNumber: number;
}
export default function ShelfComponent({ shelf, shelfNumber }: ShelfProps) {
  return (
    <>
      <Grid item container direction="row" justifyContent="left">
        <Box width="20px" mx={"0.5rem"}>
          {String.fromCharCode(shelfNumber + 65)}
        </Box>
        {Object.keys(shelf)
          .map(Number)
          .map((v, i) => (
            <>
              <LocationComponent key={v} location={shelf[v]} />
            </>
          ))}
      </Grid>
    </>
  );
}
