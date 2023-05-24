const InkModal = ({
    classNameOuter,
    className,
    children,
    hidden,
    setHidden,
    onClose,
    title,
}) => {
    return (
        <div
            className={`${classNameOuter} ${hidden ? "hidden" : ""}
                absolute w-screen h-screen top-0 left-0 z-50
                bg-ink-dark-grey bg-opacity-50 flex justify-center items-center
            `}
        >
            <div
                className={`${className} w-2/3 h-2/3 p-8 bg-ink-white rounded-md shadow-2xl flex flex-col`}
            >
                <div className="flex justify-between">
                    <h1 className="text-ink-dark-grey font-ink-catamaran text-2xl font-semibold">
                        {title}
                    </h1>

                    <img
                        src="icons/close_modal.png"
                        alt="Close"
                        className="w-8 h-8 cursor-pointer"
                        onClick={() => {
                            setHidden(true);
                            onClose && onClose();
                        }}
                    />
                </div>

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};

export default InkModal;
