const CountDown = ({unit, number}) => {
    return <div>
        <div className="h-[60px] w-[80px] flex justify-center items-center bg-[#F4F4F4] flex-col">
            <span className="text-[18px] text-gray-800">{number}</span>
            <span className="text-xs text-gray-700">{unit}</span>
        </div>
    </div>
}
export default CountDown