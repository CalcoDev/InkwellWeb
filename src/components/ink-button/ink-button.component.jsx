const InkButton = ({ className, onClick, children }) => {
    return (
        <button
            className={`
                ${className || ""}
                transition duration-300 ease-in-out
                bg-ink-transparent 
                border border-ink-white
                px-4 py-2 rounded
                
                font-ink-fira font-extralight 
                text-ink-white text-center text-sm
                tracking-ink-3 indent-ink-3
                
                hover:bg-ink-white hover:text-ink-light-grey
                hover:scale-110
                
                active:scale-90
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default InkButton;
