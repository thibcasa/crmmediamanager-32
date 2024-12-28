import { Checkbox } from "@/components/ui/checkbox";

interface SelectAllCheckboxProps {
  isAllSelected: boolean;
  onSelectAll: () => void;
}

export const SelectAllCheckbox = ({ isAllSelected, onSelectAll }: SelectAllCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2 bg-accent/50 p-2 rounded-md">
      <Checkbox 
        id="select-all"
        checked={isAllSelected}
        onCheckedChange={onSelectAll}
      />
      <label
        htmlFor="select-all"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
      </label>
    </div>
  );
};