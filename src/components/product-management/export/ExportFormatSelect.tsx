import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ExportFormatSelectProps {
  value: 'csv' | 'xlsx' | 'json';
  onChange: (value: 'csv' | 'xlsx' | 'json') => void;
}

export const ExportFormatSelect = ({ value, onChange }: ExportFormatSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Export Format</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};