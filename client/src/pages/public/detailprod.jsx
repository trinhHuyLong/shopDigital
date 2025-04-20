import { useParams } from "react-router-dom";


const DetailProd = () => {
    
    const {id,title} = useParams()
    console.log(id, title)

    return (
        <div>
        <h1>Detail Product</h1>
        <p>Details about the product will be displayed here.</p>
        </div>
    );
}

export default DetailProd;