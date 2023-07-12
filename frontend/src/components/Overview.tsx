import { Grid, Paper } from "@mui/material";

export default function Overview() {
  return (
    <>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          hi
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          hi
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>hi</Paper>
      </Grid>
    </>
  );
}
