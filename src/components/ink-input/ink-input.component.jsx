const InkInput = ({ className, value, onChange, type, label }) => {
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
                    ${value.length > 0 ? "-top-2 text-xxs" : "top-1"}
                `}
            >
                {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    className="
                w-full h-full bg-ink-transparent 
                text-ink-light-grey
                font-ink-catamaran text-sm 
                py-1 px-2 
                border-b-[1px] border-ink-lighter-grey 
                transition-all duration-300 transition-ease-in-out
                focus:outline-none focus:border-ink-white
            "
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <input
                    type={type}
                    className="
                        w-full h-full bg-ink-transparent 
                        text-ink-white
                        font-ink-catamaran text-sm 
                        py-1 px-2 
                        border-b-[1px] border-ink-lighter-grey 
                        transition-all duration-300 transition-ease-in-out
                        focus:outline-none focus:border-ink-white
                    "
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default InkInput;
