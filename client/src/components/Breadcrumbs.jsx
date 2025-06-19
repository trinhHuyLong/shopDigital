import useBreadcrumbs from "use-react-router-breadcrumbs";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Breadcrumbs = ({title,category})=>{
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title },
      ];
    
    const breadcrumbs = useBreadcrumbs(routes);
    return <div className="text-sm flex items-center gap-1">
        {breadcrumbs?.filter(el=>!el.match.route === false).map(({ match, breadcrumb },index,self) => (
        <Link className="flex gap-1 items-center hover:text-main" key={match.pathname} to={match.pathname}>
          <span className="capitalize">{breadcrumb}</span>
          {self.length > index+1&&<IoIosArrowForward />}
        </Link>
      ))}   
    </div>
}

export default Breadcrumbs