import { Link } from "react-router-dom";

const DashboardOption = ({ className, imgSrc, title, linkTo }) => {
    return (
        <div className={`${className} w-full h-[4vh] pl-[1.5vw]`}>
            <Link
                to={linkTo}
                className="w-fit h-full flex justify-start items-center py-4"
            >
                <img
                    src={imgSrc}
                    alt={title}
                    className="aspect-square min-h-[22px] h-full mr-4"
                />
                <h1 className="text-ink-white text-lg font-ink-fira font-light">
                    {title}
                </h1>
            </Link>
        </div>
    );
};

export default DashboardOption;
