import React from 'react';
import clsx from 'clsx';

const InputForm = ({
    lable,
    disable,
    register,
    errors,
    id,
    validate,
    type = 'text',
    placeholder,
    fullWidth,
    defaultValue,
    style,
}) => {
    return (
        <div className={clsx('flex flex-col', style)}>
            {lable && (
                <label htmlFor={id} className="text-sm font-semibold text-gray-700 py-2">
                    {lable}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                className={`border outline-none border-gray-300 rounded-md p-2  ${
                    fullWidth ? 'w-full' : 'w-[50%]'
                }`}
                {...register(id, validate)}
                disabled={disable}
                defaultValue={defaultValue}
            />
            {errors[id] && ( // Sử dụng name thay vì id
                <span className="mt-1 text-red-500 text-xs ">{errors[id]?.message}</span>
            )}
        </div>
    );
};

export default InputForm;
