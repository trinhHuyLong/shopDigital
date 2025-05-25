import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

export default function renderStar(number) {
    if (!Number(number) || number < 0 || number > 5) return null;
    const star = [];
    const numberF = Math.floor(number);
    const numberC = Math.ceil(number);
    for (var i = 1; i <= numberF; i++) {
        star.push(<FaStar key={i} className="text-yellow-500" />);
    }
    if (numberF !== numberC) {
        star[numberF] = <FaStarHalfAlt key={i} className="text-yellow-500" />;
    }
    for (var i = numberC + 1; i <= 5; i++) {
        star.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
    return star;
}
