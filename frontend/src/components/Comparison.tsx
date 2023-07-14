import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Configuration, DefaultApi, ErrorMessage, LocationComparison } from "../api";
import { useEffect, useState } from "react";
import ComparisonReportVisualiser from "./ComparisonReportVisualiser";
import { useReward } from "react-rewards";

export default function Comparison() {
  const config = new Configuration({ basePath: "http://localhost:8080" });
  const apiInstance = new DefaultApi(config);

  const [userCSV, setUserCSV] = useState("");
  const [reports, setReports] = useState([""]);
  const [selectedReport, setSelectedReport] = useState("");
  const [comparisonReport, setComparisonReport] = useState<LocationComparison[] | null>(null);

  const { reward, isAnimating } = useReward("confettiSrc", "confetti", {
    angle: 150,
    startVelocity: 50,
    elementSize: 20,
    elementCount: 30,
    lifetime: 200,
  });

  useEffect(() => {
    apiInstance.machineReportsGet().then(
      (data: string[]) => {
        setReports(data);
      },
      (e) => {
        console.error(e);
      }
    );
  }, []);

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file loader...");
    const files = event?.target?.files;
    if (!files || files.length !== 1) {
      console.error("files empty: ", files);
      return;
    }
    const file = files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      const resultType = typeof e.target?.result;
      if (resultType === "string") {
        const csvData = e.target?.result;

        setUserCSV(csvData as string);
        console.log("loaded csv");
      } else {
        console.error("result was not a string: ", resultType);
      }
    };

    console.log("reading file...");
    reader.readAsText(file);
  };

  const generateComparison = () => {
    apiInstance
      .generateComparisonPost({
        machineReportName: selectedReport,
        body: userCSV,
      })
      .then((value: LocationComparison[]) => {
        console.log("received comparison");
        if (!comparisonReport) {
          reward();
        }
        setComparisonReport(value);
      })
      .catch((e) => {
        // Note, it seems this typescript-fetch openapi generator
        // doesn't handle errors very nicely, so we do this...
        e.response.json().then((err: ErrorMessage) => {
          console.error(err.message);
        });
      });
  };

  return (
    <>
      <Grid item xs={9} p={2}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ComparisonReportVisualiser report={comparisonReport} />
        </Paper>
      </Grid>
      <Grid item xs={3} p={2}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4">Generate Comparison</Typography>
          <FormLabel id="radio-buttons-group-label">Machine Report</FormLabel>
          <FormControl
            sx={{ maxHeight: "100%", overflow: "auto", border: "1px solid black", p: "0.5rem", my: "0.5rem" }}
          >
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(event) => {
                console.log(event.target.value);
                setSelectedReport(event.target.value);
              }}
            >
              {reports.map((v, i) => (
                <FormControlLabel key={i} value={v} control={<Radio />} label={v} />
              ))}
            </RadioGroup>
          </FormControl>
          <input
            accept=".csv"
            style={{ display: "none" }}
            id="upload-file-button"
            type="file"
            onChange={handleFileLoad}
          />
          <label htmlFor="upload-file-button">
            <Button component="span">Upload User CSV</Button>
          </label>

          <Typography m="1rem" variant="body1">
            {userCSV === "" ? "No user csv loaded" : "CSV loaded"}
          </Typography>
          <div id="confettiSrc">
            <Button variant="contained" disabled={userCSV === "" || selectedReport === ""} onClick={generateComparison}>
              Generate Comparison
            </Button>
          </div>
        </Paper>
      </Grid>
    </>
  );
}
