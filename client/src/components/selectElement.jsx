import React from 'react';

const SelectElement = ({ value, changeValue, options }) => {
    return (
        <select
            value={value}
            onChange={e => changeValue(e.target.value)}
            className="p-2 w-full border text-sm text-gray-500 border-gray-400 outline-none py-3"
        >
            {options?.map(el => (
                <option key={el.id} value={el.value} className="">
                    {el.text}
                </option>
            ))}
        </select>
    );
};

export default SelectElement;
