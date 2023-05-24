const InkInput = ({ className, value, onChange, type, label, lightTheme }) => {
    return (
        <div className={`${className} relative w-full`}>
            <label
                className={`
                    pointer-events-none                
                    absolute 
                    text-ink-light-grey font-ink-catamaran text-sm
                    transition-all duration-300 transition-ease-in-out
                    italic
            
                    left-2
                    ${value.length > 0 ? "-top-2 text-xxs" : "top-[0.65rem]"}
                `}
            >
                {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    className={`
                    w-full h-full bg-ink-transparent 
                    font-ink-catamaran text-sm 
                    py-2 px-2 
                    border-b-[1px]
                    transition-all duration-300 transition-ease-in-out
                    focus:outline-none ${
                        lightTheme === true || lightTheme === undefined
                            ? "text-ink-white border-ink-lighter-grey focus:border-ink-white"
                            : "text-ink-dark-grey border-ink-dark-grey focus:ink-dark-grey"
                    }
                `}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <input
                    type={type}
                    className={`
                        w-full h-full bg-ink-transparent 
                        font-ink-catamaran text-sm 
                        py-2 px-2 border-b-[1px] 
                        transition-all duration-300 transition-ease-in-out
                        focus:outline-none ${
                            lightTheme === true || lightTheme === undefined
                                ? "text-ink-white border-ink-lighter-grey focus:border-ink-white"
                                : "text-ink-dark-grey border-ink-dark-grey focus:ink-dark-grey"
                        }
                    `}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default InkInput;
