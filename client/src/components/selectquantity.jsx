import { memo,useRef } from "react"

const SelectQuantity = ({quantity,handleQuantity})=>{
    const ref = useRef()
    return <div className="flex items-center">
        <span onClick={()=>handleQuantity(Number(ref.current.value)-1)} className="cursor-pointer text-[24px] border-r p-2 border-black">-</span>
        <input ref={ref} onChange={(e)=>handleQuantity(e.target.value)} className="py-2 w-[50px] outline-none text-center" type="text" value={quantity}/>
        <span onClick={()=>handleQuantity(Number(ref.current.value)+1)} className="cursor-pointer text-[24px] border-l p-2 border-black">+</span>
    </div>
}

export default memo(SelectQuantity)