import InkInput from "../ink-input/ink-input.component";

const TableViewHeader = ({
    title,
    filter,
    setFilter,
    onClickAdd,
    onClickRemove,
}) => {
    return (
        <div className="bg-ink-tables-dark-grey w-full h-16 flex justify-center items-center p-4">
            <p className="text-ink-tables-light-grey font-ink-catamaran text-lg flex-[1]">
                {title}
            </p>
            <InkInput
                className="flex-[5] mx-6"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type="text"
                label="Filter"
            />
            <div className="flex-[1] flex justify-between">
                <span
                    className="text-ink-tables-light-grey font-ink-catamaran text-3xl cursor-pointer px-2"
                    onClick={onClickAdd}
                >
                    +
                </span>
                <span
                    className="text-ink-tables-light-grey font-ink-catamaran text-3xl cursor-pointer px-2"
                    onClick={onClickRemove}
                >
                    -
                </span>
            </div>
        </div>
    );
};

export default TableViewHeader;
