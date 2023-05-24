import { atom } from "recoil";

const userState = atom({
    key: "userState",
    default: {
        connected: false,

        // TODO(calco): CHANGE THIS THIS IS JUST FOR DEVELOPMENT
        uid: "tEVNZPdhwEOFgN42ooqZuPQbkVA3",
        photoURL:
            "https://avatars.githubusercontent.com/u/89984030?s=400&u=c8f4dff9972c77b43bda33a92d60e3c49c40b2cd&v=4",
        displayName: "Calcopod",
    },
});

export default userState;
