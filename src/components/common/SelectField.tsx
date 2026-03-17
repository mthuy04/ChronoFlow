interface SelectFieldProps {
    label?: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }
  
  export default function SelectField({
    label,
    value,
    options,
    onChange,
  }: SelectFieldProps) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-[10px] uppercase tracking-widest text-[#A39C93] font-bold ml-1">
            {label}
          </label>
        )}
  
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#FDFCF8] border border-[#F0EBE1] rounded-2xl px-4 py-4 text-[#6B655E] text-sm font-light"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }