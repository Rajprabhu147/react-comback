// src/components/TripPlanner/index.js

export { default as TripPlanner } from "../../pages/TripPlanner";
export { default as CalendarSection } from "./CalendarSection";
export { default as CalendarHeader } from "./CalendarHeader";
export { default as CalendarGrid } from "./CalendarGrid";
export { default as DayActivityPopover } from "./DayActivityPopover";
export { default as ItinerarySection } from "./ItinerarySection";
export { default as FilterPanel } from "./FilterPanel";
export { default as ActivityList } from "./ActivityList";
export { default as ActivityListItem } from "./ActivityListItem";
export { default as MapSection } from "./MapSection";
export { default as ActivityEditor } from "./ActivityEditor";
export { default as ActivityForm } from "./ActivityForm";

export {
  CATEGORIES,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  INITIAL_ACTIVITIES,
  getCategoryIcon,
  getCategoryColor,
  getCategoryLabel,
} from "./constants";
