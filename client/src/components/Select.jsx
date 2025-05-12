import React from 'react';
import clsx from 'clsx';

const Select = ({
    lable,
    options = [],
    register,
    errors,
    id,
    validate,
    style,
    fullWidth,
    defaultValue,
}) => {
    return (
        <div className={clsx('flex flex-col h-[78px]', style)}>
            {lable && (
                <label className="text-sm font-semibold text-gray-700 py-2" htmlFor={id}>
                    {lable}
                </label>
            )}
            <select
                className={clsx(
                    fullWidth && 'w-full',
                    style,
                    'm-auto py-2 w-full border outline-none'
                )}
                {...register(id, validate)}
                id={id}
                defaultValue={defaultValue}
            >
                <option value="">--Choose option--</option>
                {options?.map((option, index) => (
                    <option key={index} value={option.code}>
                        {option.value}
                    </option>
                ))}
            </select>
            {errors[id] && (
                <span className="mt-1 text-red-500 text-xs ">{errors[id]?.message}</span>
            )}
        </div>
    );
};

export default Select;
