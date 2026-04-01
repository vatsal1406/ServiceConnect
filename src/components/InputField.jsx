export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoFocus = false
}) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 shadow-sm transition-all duration-300 outline-none focus:bg-white focus:ring-4 ${error
            ? "focus:ring-red-500/20 focus:border-red-500 border-red-500"
            : "focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300"
          }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
