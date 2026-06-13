import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type SortDirection = "ASC" | "DESC";

type SortIconProps = {
  active: boolean;
  direction: SortDirection;
};

export function SortIcon({ active, direction }: SortIconProps) {
  if (!active) {
    return <ArrowUpDown className="ml-1 h-4 w-4" />;
  }

  return direction === "ASC" ? (
    <ArrowUp className="ml-1 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-1 h-4 w-4" />
  );
}
