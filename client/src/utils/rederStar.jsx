import { FaStar, FaRegStar } from 'react-icons/fa';

export default function renderStar(number) {
    if (!Number(number) || number < 0 || number > 5) return null;
    const star = [];
    for (var i = 1; i <= number; i++) {
        star.push(<FaStar key={i} className="text-yellow-500" />);
    }
    for (var i = Math.floor(number) + 1; i <= 5; i++) {
        star.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
    return star;
}
