'use client';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import LucideIcon from '../LucideIcon';

export default function Checkbox({
    onChange,
    direction = 'vertical',
    options,
    value = [],
    ...props
}: ICOMPONENTS.CheckboxProps) {
    // Define a type for the props that excludes incompatible ones
    type RadixCheckboxProps = Omit<React.ComponentProps<typeof RadixCheckbox.Root>, 'onAnimationStart' | 'labels'>;

    return (
        <div className={`flex ${direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>

            {options && options.map((option, index) => {
                const optionValue = option.value || option.key;
                const optionKey = option.key;
                
                return (
                    <label
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <RadixCheckbox.Root
                            {...(props as RadixCheckboxProps)} // Cast props to the new type
                            checked={String(value).includes(optionValue)}
                            onCheckedChange={(checked) => {
                                if (!onChange) return;
                                const isChecked = checked === true;
                                const mockEvent = { target: { checked: isChecked } } as React.ChangeEvent<HTMLInputElement>;
                                onChange(mockEvent, optionValue);
                            }}
                            className="w-5 h-5 bg-white border border-gray-400 rounded data-[state=checked]:bg-[#F6AC69] flex items-center justify-center transition-colors"
                        >
                            <RadixCheckbox.Indicator>
                                <LucideIcon name='Check' iconColor='white' className="bg-primary w-4 h-4" />
                            </RadixCheckbox.Indicator>
                        </RadixCheckbox.Root>
                        <span>{optionKey}</span>
                    </label>
                );
            })}

        </div>
    );
}
