const SignPageContainer = ({ children }) => {
    return (
        <div className="spacer bg-[url('waves/sign_waves.png')] h-screen bg-ink-medium-grey flex justify-center items-center">
            <div className="w-1/4 min-w-[170px] max-w-[400px] h-1/2">
                <h1 className="text-ink-white text-4xl font-ink-libre text-center mb-20">
                    Inkwell
                </h1>

                {children}
            </div>
        </div>
    );
};

export default SignPageContainer;
