import { Tooltip, Box } from "@mui/material";
import { LocationComparison, LocationComparisonStatusEnum } from "../../api";

interface LocationProps {
  location: LocationComparison;
}

export default function LocationComponent({ location }: LocationProps) {
  // Define a function to map status to color
  const getColor = (status: LocationComparisonStatusEnum): string => {
    switch (status) {
      case LocationComparisonStatusEnum.NotScanned:
        return "#EEE";
      case LocationComparisonStatusEnum.EmptyAsExpected:
        return "#BBB";
      case LocationComparisonStatusEnum.EmptyButItShouldHaveBeenOccupied:
        return "orange";
      case LocationComparisonStatusEnum.OccupiedByTheWrongItems:
      case LocationComparisonStatusEnum.OccupiedByAnItemButShouldHaveBeenEmpty:
      case LocationComparisonStatusEnum.OccupiedButNoBarcodeCouldBeIdentified:
        return "red";
      case LocationComparisonStatusEnum.OccupiedByTheExpectedItems:
        return "green";
      default:
        return "#555";
    }
  };

  const hoverDetails = (
    <div>
      <p>Name: {location.name}</p>
      <p>Scanned: {location.scanned ? "Yes" : "No"}</p>
      <p>Occupied: {location.occupied ? "Yes" : "No"}</p>
      <p>Expected Barcodes: {location.expectedBarcodes.join(", ")}</p>
      <p>Detected Barcodes: {location.detectedBarcodes.join(", ")}</p>
      <p>Status: {location.status}</p>
    </div>
  );

  return (
    <Tooltip title={hoverDetails} arrow>
      <Box
        sx={{
          width: "20px",
          height: "20px",
          backgroundColor: getColor(location.status),
          margin: "2px",
        }}
      ></Box>
    </Tooltip>
  );
}
