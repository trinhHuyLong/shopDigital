import { useState } from 'react';

const InputField = ({
    value,
    setValue,
    nameKey,
    type,
    invalidFields,
    setInvalideFiedls,
    isHideLable,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full flex flex-col mb-2 relative">
            {!isHideLable && (isFocused || value.trim() !== '') && (
                <label className="bg-white text-[10px] animate-slide-top-sm absolute top-0 left-[12px] px-[4px]">
                    {nameKey}
                </label>
            )}
            <input
                type={type || 'text'}
                className="px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none"
                placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(e.target.value)}
                onFocus={() => {
                    setIsFocused(true);
                    setInvalideFiedls && setInvalideFiedls([]);
                }}
                onBlur={() => setIsFocused(false)}
            />
            {invalidFields?.some(el => el.name === nameKey.split(' ')[0]?.toLowerCase()) && (
                <small className="text-main text-[12px] italic">
                    {
                        invalidFields?.find(el => el.name === nameKey.split(' ')[0].toLowerCase())
                            ?.mes
                    }
                </small>
            )}
        </div>
    );
};

export default InputField;
