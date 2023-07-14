import { Divider, Typography } from "@mui/material";
import { Shelf } from "../Types";
import ShelfComponent from "./ShelfComponent";

interface RackProps {
  rack: Record<number, Shelf>;
}
export default function RackComponent({ rack }: RackProps) {
  return (
    <>
      {Object.keys(rack)
        .map(Number)
        .map((v, i) => (
          <>
            <Divider sx={{ my: "2px" }} />
            <ShelfComponent key={v} shelf={rack[v]} shelfNumber={v} />
          </>
        ))}
    </>
  );
}
