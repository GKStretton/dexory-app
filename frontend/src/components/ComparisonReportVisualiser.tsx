import { Badge, Divider, FormControlLabel, Grid, Switch, Tab, Tabs, Typography } from "@mui/material";
import { ApiResponse, LocationComparison, LocationComparisonStatusEnum } from "../api";
import { useState } from "react";
import { StatusCount, Warehouse } from "./Types";
import StatusSummary from "./visualisation/StatusSummary";
import RackComponent from "./visualisation/RackComponent";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface ParseReportReturn {
  warehouse: Warehouse;
  // rack code -> StatusCount
  rackStatusCount: Record<string, StatusCount>;
  overallStatusCount: StatusCount;
}
function ParseReport(report: LocationComparison[]): ParseReportReturn {
  const warehouse: Warehouse = {};
  const rackStatusCount: Record<string, StatusCount> = {};
  const overallStatusCount: StatusCount = {};

  for (let location of report) {
    // Locate based on name
    const { name } = location;
    const rackName = name.substring(0, 2);
    const position = parseInt(name.substring(2, 5));
    const shelf = name.charCodeAt(5) - 65; // ASCII value of 'A' is 65

    // Initialize rack if it doesn't exist
    if (!warehouse[rackName]) warehouse[rackName] = {};
    if (!rackStatusCount[rackName]) rackStatusCount[rackName] = {};

    // Initialize shelf if it doesn't exist
    if (!warehouse[rackName][shelf]) warehouse[rackName][shelf] = {};

    // Add location to correct position in shelf
    warehouse[rackName][shelf][position] = location;

    // update statuses
    if (!rackStatusCount[rackName][location.status]) rackStatusCount[rackName][location.status] = 0;
    rackStatusCount[rackName][location.status]++;

    if (!overallStatusCount[location.status]) overallStatusCount[location.status] = 0;
    overallStatusCount[location.status]++;
  }
  return {
    warehouse,
    rackStatusCount,
    overallStatusCount,
  };
}

interface VisualiserArgs {
  report: LocationComparison[] | null;
}
export default function ComparisonReportVisualiser({ report }: VisualiserArgs) {
  const [visual, setVisual] = useState(true);
  const [selectedRack, setSelectedRack] = useState("");

  if (!report) {
    return <Typography variant="h3">Please generate a report</Typography>;
  }

  const { warehouse, rackStatusCount, overallStatusCount } = ParseReport(report);

  // Ensure a rack is selected
  if (selectedRack == "" || !(selectedRack in warehouse)) {
    const racks = Object.keys(warehouse);
    if (racks.length > 0) {
      setSelectedRack(racks[0]);
    } else {
      return <Typography variant="h4">No racks found</Typography>;
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedRack(newValue);
  };

  function numberOfErrors(count: StatusCount): number {
    let errorCount = 0;

    errorCount += count[LocationComparisonStatusEnum.EmptyButItShouldHaveBeenOccupied] ?? 0;
    errorCount += count[LocationComparisonStatusEnum.OccupiedByTheWrongItems] ?? 0;
    errorCount += count[LocationComparisonStatusEnum.OccupiedByAnItemButShouldHaveBeenEmpty] ?? 0;
    errorCount += count[LocationComparisonStatusEnum.OccupiedButNoBarcodeCouldBeIdentified] ?? 0;

    return errorCount;
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
          <Grid container flexDirection="column">
            <Grid item container justifyContent="center" mt="0.5rem">
              <Typography variant="h6">Rack</Typography>
            </Grid>

            <Grid item container justifyContent="center">
              <Tabs
                value={selectedRack}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="rack selector"
              >
                {Object.keys(warehouse).map((v, _) => (
                  <Tab
                    label={
                      <>
                        <Badge
                          badgeContent={numberOfErrors(rackStatusCount[v])}
                          color="error"
                          sx={{
                            ".MuiBadge-badge": { top: -4, right: -10 },
                          }}
                        >
                          {v}
                        </Badge>
                      </>
                    }
                    value={v}
                    key={v}
                  />
                ))}
              </Tabs>
            </Grid>

            <StatusSummary statusCount={overallStatusCount} rackCount={rackStatusCount[selectedRack]} />

            <Grid item container direction="column-reverse">
              <RackComponent rack={warehouse[selectedRack]} />
            </Grid>
          </Grid>
        </>
      ) : (
        <textarea readOnly style={{ height: "800px" }} value={JSON.stringify(report, null, 2)}></textarea>
      )}
    </>
  );
}
