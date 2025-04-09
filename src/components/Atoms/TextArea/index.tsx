'use client';

import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

export default function TextArea(props: ICOMPONENTS.TextAreaProps) {
    const {
        width,
        height,
        fontSize,
        resize = "both",
        style,
        className = '',
        maxLength,
        ...rest
    } = props;

    const [value, setValue] = useState<string>(rest.value?.toString() || '');

    useEffect(() => {
        if (typeof rest.value === 'string') setValue(rest.value);
    }, [rest.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        rest.onChange?.(e);
    };

    const textareaStyle: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        resize: resize,
        ...style,
    };

    const percentage = maxLength ? (value.length / maxLength) * 100 : 0;

    const getCharCountColor = () => {
        if (percentage >= 90) return 'var(--error)';
        if (percentage >= 75) return 'var(--pending)';
        return '#999';
    };


    return (
        <div className={styles.wrapper}>
            <textarea
                className={`${styles.textarea} ${className}`}
                style={textareaStyle}
                value={value}
                onChange={handleChange}
                maxLength={maxLength}
                {...rest}
            />
            {typeof maxLength === 'number' && (
                <div
                    className={styles.charCount}
                    style={{ color: getCharCountColor() }}
                >
                    {value.length} / {maxLength}
                </div>
            )}
        </div>
    );
}
