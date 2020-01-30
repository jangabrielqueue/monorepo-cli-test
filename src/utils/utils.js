// Utility Functions

import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function isNullOrWhitespace(input) {
  if (typeof input === "undefined" || input == null) return true;
  return input.replace(/\s/g, "").length < 1;
}

export { useQuery, isNullOrWhitespace };
