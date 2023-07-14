import { LocationComparison } from "../api";

// LocationComparisonStatusEnum -> number
export type StatusCount = Record<string, number>;

export type Shelf = Record<number, LocationComparison>;
export type Rack = Record<number, Shelf>;
export type Warehouse = Record<string, Rack>;