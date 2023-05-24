const ProjectCard = ({ name, description, authors, date }) => {
    return (
        <div className="active:scale-90 hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 rounded-md bg-ink-blue flex flex-col justify-between items-center p-4 min-h-[8rem] h-[30vh] max-h-[16rem]">
            <div>
                <h1 className="text-ink-white font-ink-catamaran text-2xl font-semibold">
                    {name}
                </h1>
                <p className="text-ink-light-blue font-ink-catamaran text-base font-light">
                    {description}
                </p>
            </div>

            <div className="w-full flex justify-between">
                {/* 
                TODO(calco): Display all authors. For now a plceholder will do.
                
                <div>
                    {authors.map((author) => (
                        <img src={author.photoURL} alt={author.displayName} />
                    ))}
                </div> */}
                <img
                    src="icons/user_placeholder.png"
                    alt="Placeholder of project owner"
                />

                <p className="text-ink-white font-ink-fira text-base font-bold">
                    {date}
                </p>
            </div>
        </div>
    );
};

export default ProjectCard;
