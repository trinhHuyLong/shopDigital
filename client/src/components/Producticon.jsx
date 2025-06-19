const ProductIcon = ({icon,title,sub})=>{
    return <div className="flex items-center p-3 gap-4 mb-[10px] border">
        <span className="text-white p-2 bg-gray-600 flex items-center justify-center rounded-full">{icon}</span>
        <div className="flex flex-col text-sm text-gray-500">
            <span className="font-medium text-gray-600">{title}</span>
            <span className="text-xs">{sub}</span>
        </div>
    </div>
}

export default ProductIcon