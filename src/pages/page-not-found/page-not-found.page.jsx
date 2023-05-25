import { useNavigate } from "react-router-dom";
import InkButton from "../../components/ink-button/ink-button.component";

// TODO(calco): Modify this page to be more user friendly
const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-ink-medium-grey flex flex-col justify-center items-center">
            <div>
                <h1 className="text-ink-white text-4xl font-ink-libre text-center mb-4">
                    Oops!
                </h1>
                <h2 className="text-ink-white text-4xl font-ink-libre text-center mb-10">
                    It appears you wandered off course and got lost.
                </h2>
            </div>

            <div className="flex scale-150">
                <InkButton className="mr-4" onClick={() => navigate("/")}>
                    HOME
                </InkButton>
                <InkButton className="ml-4" onClick={() => navigate(-1)}>
                    BACK
                </InkButton>
            </div>
        </div>
    );
};

export default PageNotFound;
