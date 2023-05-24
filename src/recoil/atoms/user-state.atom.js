import { atom } from "recoil";

const userState = atom({
    key: "userState",
    default: {
        connected: false,

        uid: "-1",
        displayName: "user_debug",
        photoURL: "",
    },
});

export default userState;
