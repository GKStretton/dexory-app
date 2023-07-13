import { FormControlLabel, Switch, Typography } from "@mui/material";
import { LocationComparison } from "../api";
import { useState } from "react";

interface VisualiserArgs {
  report: LocationComparison[] | null;
}

export default function ComparisonReportVisualiser({ report }: VisualiserArgs) {
  const [visual, setVisual] = useState(false);
  if (!report) {
    return <Typography variant="h3">Please generate a report</Typography>;
  }

  return (
    <>
      <FormControlLabel
        value="visual"
        control={
          <Switch
            checked={visual}
            onChange={(e, checked) => {
              setVisual(checked);
            }}
            color="primary"
          />
        }
        label="Visual"
        labelPlacement="start"
      />
      {visual ? (
        <>
          <Typography variant="h2">Fancy Stuff</Typography>
        </>
      ) : (
        <textarea readOnly style={{ height: "800px" }} value={JSON.stringify(report, null, 2)}></textarea>
      )}
    </>
  );
}
