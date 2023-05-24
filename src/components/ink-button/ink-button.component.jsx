const InkButton = ({ className, onClick, children, lightTheme }) => {
    return (
        <button
            className={`
                ${className || ""}
                transition duration-300 ease-in-out
                bg-ink-transparent 
                border px-4 py-2 rounded
                
                font-ink-fira font-extralight 
                text-center text-sm
                tracking-ink-3 indent-ink-3
                
                hover:scale-110
                
                active:scale-90
                
                ${
                    lightTheme === true || lightTheme === undefined
                        ? "border-ink-white text-ink-white hover:bg-ink-white hover:text-ink-dark-grey"
                        : "border-ink-dark-grey text-ink-dark-grey hover:bg-ink-dark-grey hover:text-ink-white"
                }
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default InkButton;
