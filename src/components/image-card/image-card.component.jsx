const ImageCard = ({
    imageUrl,
    title,
    description,
    className,
    onClick,
    solidColour,
}) => {
    return (
        <div
            className={`${className}
                bg-ink-blue rounded-md min-h-fit overflow-hidden h-[25vh]
                active:scale-95 hover:cursor-pointer hover:scale-105 transition-all ease-in-out duration-300
                drop-shadow-lg shadow-black
            `}
            onClick={onClick}
        >
            {solidColour ? (
                <div
                    className={`w-full h-1/2 rounded-t-md object-cover ${solidColour}`}
                ></div>
            ) : (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-1/2 rounded-t-md object-cover bg-ink-dark-grey"
                />
            )}
            <div className="w-full h-1/2 p-4 pt-2">
                <h1 className="text-ink-white text-lg font-normal font-ink-fira">
                    {title}
                </h1>
                <p className="text-ink-white text-base font-light font-ink-catamaran">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ImageCard;
