import { string } from "prop-types";

export const GOAL_COLORS = [
  "#99E897",
  "#97D4E8",
  "#CF2E38",
  "#A797E8",
  "#DC97E8",
  "#E8A097",
  "#D6DE6C"
];

export interface completedDay {
  date: string;
  goal: string;
  notes: string;
}

export interface goal {}
