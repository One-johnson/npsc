import * as React from "react";

/** Sheet for registration on phones and tablets; dialog on large desktops. */
export const REGISTRATION_SHEET_BREAKPOINT = 1024;
const QUERY = `(max-width: ${REGISTRATION_SHEET_BREAKPOINT - 1}px)`;

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useRegistrationSheetLayout() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
