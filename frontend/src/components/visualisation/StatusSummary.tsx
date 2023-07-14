import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { StatusCount } from "../Types";
import { LocationComparisonStatusEnum } from "../../api";

interface Props {
  statusCount: StatusCount;
  rackCount: StatusCount;
}

export default function StatusSummary({ statusCount = {}, rackCount = {} }: Props) {
  return (
    <TableContainer component={Paper} sx={{ my: "1rem" }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              In Total
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              In this Rack
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(LocationComparisonStatusEnum).map((v) => (
            <TableRow key={v} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {v}
              </TableCell>
              <TableCell align="left">{statusCount[v] ?? 0}</TableCell>
              <TableCell align="left">{rackCount[v] ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
