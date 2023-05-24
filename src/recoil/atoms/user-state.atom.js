import { atom } from "recoil";

// TODO(calco): Consider loading the projects on sign in.
/*
USER: uid: string - name
    displayName: string
    email: string
    createdAt: Date
    photoURL: string
    projects: [Project]
*/

// TODO(calco): PRODUCTION UNCOMMENT
const userState = atom({
    key: "userState",
    default: {
        connected: true,
        uid: "tEVNZPdhwEOFgN42ooqZuPQbkVA3",
        photoURL:
            "https://avatars.githubusercontent.com/u/89984030?s=400&u=c8f4dff9972c77b43bda33a92d60e3c49c40b2cd&v=4",
        displayName: "Calcopod",
    },
});

export default userState;
