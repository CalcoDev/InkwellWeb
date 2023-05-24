import { atom } from "recoil";

const userState = atom({
    key: "userState",
    default: {
        connected: false,

        id: "-1",
        name: "user_debug",
        profilePicture: "",
    },
});

export default userState;
