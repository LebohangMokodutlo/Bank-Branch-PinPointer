const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Branch', label: 'Branches' },
  { value: 'Atm', label: 'ATMs' },
];

const BranchTypeFilter = ({ value, onChange }) => {
  return (
    <div className="flex gap-1 rounded-md border border-gray-300 bg-white p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded px-3 py-1 text-sm font-medium ${
            value === option.value ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default BranchTypeFilter;
