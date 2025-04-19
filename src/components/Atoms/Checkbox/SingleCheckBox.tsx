import * as Checkbox from "@radix-ui/react-checkbox";
import { FC } from "react";
import { cn } from "@helpers/CN";
import LucideIcon from "../LucideIcon";

interface SingleCheckboxProps {
    label?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const SingleCheckbox: FC<SingleCheckboxProps> = ({
    label,
    checked,
    onChange,
    disabled = false,
    className,
}) => {
    return (
        <div
            className={cn(
                "flex items-center gap-2 select-none",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <Checkbox.Root
                className={cn(
                    "w-5 h-5 border rounded flex items-center justify-center transition-colors",
                    checked ? "bg-[#F6AC69] border-gray-400" : "bg-white border-gray-400",
                    disabled && "bg-gray-200"
                )}
                checked={checked}
                onCheckedChange={(value) =>
                    !disabled && onChange(!!value) // value can be boolean or 'indeterminate'
                }
                disabled={disabled}
            >
                <Checkbox.Indicator>
                    <LucideIcon name='Check' iconColor='white' className="bg-primary w-4 h-4" />
                </Checkbox.Indicator>
            </Checkbox.Root>
            {label && <span className="text-sm">{label}</span>}
        </div>
    );
};

export default SingleCheckbox;
