import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import swal from 'sweetalert2';

import path from '../../utils/path';

const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (status === 'failed') {
            swal.fire('Oops!', 'Đăng kí không thành công', 'error').then(() => {
                navigate(`/${path.LOGIN}`);
            });
        }
        if (status === 'successed') {
            swal.fire('Congratuation!', 'Đăng kí thành công. Hãy đăng nhập', 'success').then(() => {
                navigate(`/${path.LOGIN}`);
            });
        }
    }, []);
    return <div className="h-screen w-sceen bg-gray-100"></div>;
};

export default FinalRegister;
