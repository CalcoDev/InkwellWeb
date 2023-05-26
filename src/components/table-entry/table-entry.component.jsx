const TableEntry = ({ name, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
            cursor-pointer
                w-full 
                pl-6 pr-2 py-2
                ${
                    isSelected
                        ? "bg-ink-tables-light-grey text-ink-tables-dark-grey"
                        : "bg-ink-tables-mid-grey text-ink-tables-light-grey"
                }
            `}
        >
            {name}
        </div>
    );
};

export default TableEntry;
