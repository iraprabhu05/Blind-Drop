import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface RadiusFilterProps {
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
}

export const RadiusFilter = ({
  selectedRadius,
  onRadiusChange,
}: RadiusFilterProps) => {
  return (
    <ToggleGroup
      type="single"
      defaultValue={String(selectedRadius)}
      onValueChange={(value) => {
        if (value) {
          onRadiusChange(Number(value));
        }
      }}
      className="gap-2"
    >
      <ToggleGroupItem value="1" aria-label="1 km">
        1 km
      </ToggleGroupItem>
      <ToggleGroupItem value="5" aria-label="5 km">
        5 km
      </ToggleGroupItem>
      <ToggleGroupItem value="20" aria-label="20 km">
        20 km
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
