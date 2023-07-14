import { Divider, Typography } from "@mui/material";
import { Shelf } from "../Types";
import ShelfComponent from "./ShelfComponent";
import React from "react";

interface RackProps {
  rack: Record<number, Shelf>;
}
export default function RackComponent({ rack = {} }: RackProps) {
  return (
    <>
      {Object.keys(rack)
        .map(Number)
        .map((v, i) => (
          <React.Fragment key={v}>
            <Divider sx={{ my: "2px" }} />
            <ShelfComponent shelf={rack[v]} shelfNumber={v} />
          </React.Fragment>
        ))}
    </>
  );
}
