import React, { useState } from 'react';

const CheckoutPayment = ({ onVnpay, onCash }) => {
    const [selected, setSelected] = useState('');

    const handleConfirm = () => {
        if (selected === 'vnpay') onVnpay();
        else if (selected === 'cash') onCash();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Chọn phương thức thanh toán
                </h2>

                <div className="flex flex-col gap-4">
                    <label
                        className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between ${
                            selected === 'vnpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                    >
                        <span>Thanh toán qua VNPAY</span>
                        <input
                            type="radio"
                            name="payment"
                            checked={selected === 'vnpay'}
                            onChange={() => setSelected('vnpay')}
                        />
                    </label>

                    <label
                        className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between ${
                            selected === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                        }`}
                    >
                        <span>Thanh toán khi nhận hàng</span>
                        <input
                            type="radio"
                            name="payment"
                            checked={selected === 'cash'}
                            onChange={() => setSelected('cash')}
                        />
                    </label>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!selected}
                    className="mt-6 w-full bg-main text-white py-2 rounded-xl hover:opacity-80 disabled:opacity-50"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
};

export default CheckoutPayment;
