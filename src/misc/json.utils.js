import { checkProjectValidity } from "./table.utils";

const jsonFromFile = async (file) => {
    const reader = new FileReader();
    reader.readAsText(file);

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            try {
                resolve(JSON.parse(reader.result));
            } catch (error) {
                reject("Invalid JSON file.");
            }
        };
        reader.onerror = () => {
            reject("File reader encountered an error.");
        };
    });
};

export const loadProjectFromFile = async (file) => {
    try {
        const json = await jsonFromFile(file);

        const [isValid, errorMessage] = checkProjectValidity(json);

        if (!isValid)
            return {
                succeded: false,
                errorCode: "JSON file is not a valid project: " + errorMessage,
            };

        return {
            succeded: true,
            project: json,
        };
    } catch (error) {
        return {
            succeded: false,
            errorCode: error.message,
        };
    }
};
