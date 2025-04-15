'use client';

export default function Checkbox({
    onChange,
    direction = "vertical",
    options,
    value = [],
    ...props
}: ICOMPONENTS.CheckboxProps & { value: string[] }) {
    return (
        <div>
            {options && options.map((option, index) => (
                <label
                    key={index}
                    className={`items-center gap-2 cursor-pointer ${direction === "horizontal" ? "inline-flex" : "flex"}`}
                >
                    <input
                        type="checkbox"
                        onChange={(e) => onChange && onChange(e, option.key)}
                        checked={value.includes(option.key)}
                        {...props}
                        className="w-4 h-4"
                    />
                    <span>{option.label}</span>
                </label>
            ))}
        </div>
    );
}
