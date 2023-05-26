import InkButton from "../ink-button/ink-button.component";

const UserDisplay = ({ imgSrc, email, username, onRemove, isOwner }) => {
    return (
        <div className="flex items-center mb-2 h-8 ml-4">
            <img
                className="aspect-square h-full rounded-full mr-4"
                src={imgSrc}
                alt={username}
            />
            <div className="text-ink-dark-light-blue font-ink-fira font-normal text-lg">
                {email}
            </div>

            {!isOwner && (
                <InkButton
                    className="ml-auto"
                    lightTheme={false}
                    onClick={onRemove}
                >
                    REMOVE
                </InkButton>
            )}
        </div>
    );
};

export default UserDisplay;
