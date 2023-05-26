import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
    Timestamp,
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword as siweap,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
    checkEntryTypeValidity,
    checkEntryValidity,
} from "../misc/table.utils";

const config = {
    apiKey: "AIzaSyCQgm6Ha6hW_FvU9PVx7enSIgh42Li9Uyo",
    authDomain: "inkwell-6fd82.firebaseapp.com",
    projectId: "inkwell-6fd82",
    storageBucket: "inkwell-6fd82.appspot.com",
    messagingSenderId: "696275361314",
    appId: "1:696275361314:web:ff155c9a6add967364f47b",
    measurementId: "G-X74K3KNJ1Q",
};
const app = initializeApp(config);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account",
});

export const signInWithGoogle = async () => {
    try {
        const { user } = await signInWithPopup(auth, provider);

        // TODO(calco): Warn the user that signing in with google will migrate all data to google account.

        const userData = await addUserToDatabase(user, {
            photoURL: user.photoURL || `https://robohash.org/${user.uid}.png`,
        });

        return {
            succeded: true,
            user: {
                uid: user.uid,
                ...userData,
            },
        };
    } catch (error) {
        return {
            succeded: false,
            errorCode: "Error signing in with Google. Please try again!",
        };
    }
};

export const signInWithEmailAndPassword = async (email, password) => {
    try {
        const li = await fetchSignInMethodsForEmail(auth, email);
        if (!li.includes("password") && li.length > 0)
            return {
                succeded: false,
                errorCode:
                    "Email already in use, maybe in the form of another provider.",
            };

        const { user } = await siweap(auth, email, password);

        try {
            const userData = (
                await getDoc(doc(db, `users/${user.uid}`))
            ).data();
            return {
                succeded: true,
                user: {
                    uid: user.uid,
                    ...userData,
                },
            };
        } catch (error) {
            return {
                succeded: false,
                errorCode:
                    "Error reading user data from database. Please try again!",
            };
        }
    } catch (error) {
        return {
            succeded: false,
            errorCode: error.message,
        };
    }
};

export const signUpWithEmailAndPassword = async (
    email,
    password,
    additionalParams
) => {
    try {
        const li = await fetchSignInMethodsForEmail(auth, email);
        if (li.length > 0)
            return {
                succeded: false,
                errorCode:
                    "Email already in use, maybe in the form of another provider.",
            };

        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const userData = await addUserToDatabase(user, {
            photoURL: `https://robohash.org/${user.uid}.png`,
            ...additionalParams,
        });

        return { succeded: true, user: userData };
    } catch (error) {
        return {
            succeded: false,
            errorCode: error.message,
        };
    }
};

export const signOut = async () => {
    try {
        await auth.signOut();
        return { succeded: true };
    } catch (error) {
        return {
            succeded: false,
            errorCode: "Error signing out. Please try again!",
        };
    }
};

// Firestore DB
const db = getFirestore(app);

/*
USER: uid: string - name
    displayName: string
    email: string
    createdAt: Date
    photoURL: string
    projects: [Project]

PROJECT: uid: string - name
    name: string
    description: string
    createdAt: Date
    members: [User]
*/

const addUserToDatabase = async (authObject, otherProps) => {
    // This will fire on sign out as well:
    if (!authObject) return;

    // Get the user ref and check if it is empty
    const userRef = doc(db, `users/${authObject.uid}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        // Create a new object with all of the info we want:
        const { displayName, email } = authObject;
        const createdAt = new Date();

        // Add user to database:
        try {
            setDoc(userRef, {
                displayName: displayName || email.split("@")[0],
                email,
                createdAt,
                projects: [],
                ...otherProps,
            });
        } catch (error) {
            throw "Error adding user to the database. Please try again!";
        }
    } else {
        console.log("NOT ERROR: User already exists in the database.");
    }

    return (await getDoc(userRef)).data();
};

export const convertFirebaseProjectToProjectState = (project, projectUID) => {
    const { name, description, createdAt, members } = project;
    return {
        uid: projectUID,
        local: false,
        name,
        description,
        createdAt,
        members,
        tables: [],
    };
};

// -----------------------
export const loadFirebaseProjectToProjectState = async (projectUID) => {
    const tableRefs = collection(db, `projects/${projectUID}/tables`);
    const tableSnapshot = await getDocs(tableRefs);

    if (tableSnapshot.empty) {
        // TODO(calco): Differentiate between actually failing to fetch and no tables.
        return {
            succeded: true,
            project: {
                tables: [],
            },
        };
    }

    const tablesPromise = tableSnapshot.docs.map((tableDoc) =>
        loadFirebaseTable(tableDoc)
    );
    const tables = await Promise.all(tablesPromise);

    return {
        succeded: true,
        project: {
            tables,
        },
    };
};

const loadFirebaseTable = async (tableDoc) => {
    const table = tableDoc.data();
    const tableRef = tableDoc.ref;

    const facts = await loadFirebaseEntryList(tableRef, "facts");
    const events = await loadFirebaseEntryList(tableRef, "events");
    const rules = await loadFirebaseEntryList(tableRef, "rules");

    return {
        uid: tableDoc.id,
        ...table,
        facts,
        events,
        rules,
    };
};

const loadFirebaseEntryList = async (tableRef, entryType) => {
    const refs = collection(tableRef, entryType);
    const snapshots = await getDocs(refs);

    if (snapshots.empty) {
        return [];
    }

    return snapshots.docs.map((docs) => {
        const entry = docs.data();
        return {
            ...entry,
            uid: docs.id,
        };
    });
};

// No custom returns for this method, just call addfirebase entry
export const TEST_addFirebaseEntry = async (
    projectUID,
    tableUID,
    entryType,
    entryData
) => {
    const tableRef = doc(db, `projects/${projectUID}/tables/${tableUID}`);
    return await addFirebaseEntry(tableRef, entryType, entryData);
};

export const TEST_updateFirebaseEntry = async (
    projectUID,
    tableUID,
    entryType,
    entryUID,
    entryData
) => {
    const tableRef = doc(db, `projects/${projectUID}/tables/${tableUID}`);
    return await updateFirebaseEntry(tableRef, entryType, entryUID, entryData);
};

export const TEST_deleteFirebaseEntry = async (
    projectUID,
    tableUID,
    entryType,
    entryUID
) => {
    const tableRef = doc(db, `projects/${projectUID}/tables/${tableUID}`);
    return await deleteFirebaseEntry(tableRef, entryType, entryUID);
};

export const createTable = async (projectUID, name) => {
    const projectRef = doc(db, `projects/${projectUID}`);
    const tableRef = collection(projectRef, "tables");

    const tableCounter = (await getDoc(projectRef)).data()["tableCounter"];

    try {
        const table = await addDoc(tableRef, {
            name,
            id: tableCounter,
            createdAt: Timestamp.now(),
            factsCounter: 0,
            eventsCounter: 0,
            rulesCounter: 0,
            counter: 0,
        });

        console.log(table);

        await updateDoc(projectRef, {
            tableCounter: tableCounter + 1,
        });

        return {
            succeded: true,
            table: (await getDoc(table)).data(),
        };
    } catch (error) {
        console.log(error);

        return {
            succeded: false,
            errorCode:
                "Error creating table. Please try again or contact support.",
        };
    }
};

export const removeTable = async (projectUID, tableUID) => {
    const projectRef = doc(db, `projects/${projectUID}`);
    const tableRef = doc(projectRef, `tables/${tableUID}`);

    await deleteDoc(tableRef);
};

// ! ENTRY TYPE IS SINGULAR FORM
const addFirebaseEntry = async (tableRef, entryType, entryData) => {
    let res = checkEntryTypeValidity(entryType);
    if (!res.succeded) return res;

    const globalCounter = (await getDoc(tableRef)).data()["counter"];
    const typeCounter = (await getDoc(tableRef)).data()[`${entryType}sCounter`];
    entryData = {
        ...entryData,
        id: globalCounter,
    };

    // TODO(calco): Re enable entry validation/
    // res = checkEntryValidity(entryType, entryData);
    // if (!res[0]) {
    //     return {
    //         succeded: false,
    //         errorCode: res[1],
    //     };
    // }

    await updateDoc(tableRef, {
        [`${entryType}sCounter`]: typeCounter + 1,
        counter: globalCounter + 1,
    });

    const refs = collection(tableRef, `${entryType}s`);
    const docRef = await addDoc(refs, entryData);

    return docRef.id;
};

const updateFirebaseEntry = async (
    tableRef,
    entryType,
    entryUID,
    entryData
) => {
    const res = checkEntryTypeValidity(entryType);
    if (!res.succeded) return res;

    const refs = collection(tableRef, `${entryType}s`);
    const docRef = doc(refs, entryUID);
    await updateDoc(docRef, entryData);

    return { succeded: true, entryData: (await getDoc(docRef)).data() };
};

export const deleteFirebaseEntryById = async (
    projectUID,
    tableUID,
    entryId
) => {
    const tableRef = doc(db, `projects/${projectUID}/tables/${tableUID}`);

    // check if entry is a fact, event or rule
    const facts = collection(tableRef, "facts");
    const events = collection(tableRef, "events");
    const rules = collection(tableRef, "rules");

    const qF = query(facts, where("id", "==", entryId));
    const qE = query(events, where("id", "==", entryId));
    const qR = query(rules, where("id", "==", entryId));

    const factSnapshot = await getDocs(qF);
    const eventSnapshot = await getDocs(qE);
    const ruleSnapshot = await getDocs(qR);

    if (!factSnapshot.empty) {
        console.log("fact");
        await deleteDoc(factSnapshot.docs[0].ref);
        return;
    }

    if (!eventSnapshot.empty) {
        console.log("event");
        await deleteDoc(eventSnapshot.docs[0].ref);
        return;
    }

    if (!ruleSnapshot.empty) {
        console.log("rule");
        await deleteDoc(ruleSnapshot.docs[0].ref);
        return;
    }

    console.log("not found");
    return;
};

const updateFirebaseEntryRef = async (entryRef, entryData) => {
    await updateDoc(entryRef, entryData);
};

const deleteFirebaseEntry = async (tableRef, entryType, entryUID) => {
    const res = checkEntryTypeValidity(entryType);
    if (!res.succeded) return res;

    const refs = collection(tableRef, `${entryType}s`);
    const docRef = doc(refs, entryUID);

    const typeCounter = (await getDoc(tableRef)).data()[`${entryType}sCounter`];
    await updateDoc(tableRef, {
        [`${entryType}sCounter`]: typeCounter - 1,
    });

    await deleteDoc(docRef);
};

const deleteFirebaseEntryRef = async (entryRef) => {
    await deleteDoc(entryRef);
};

// -----------------------

export const getUserProjects = async (userUID) => {
    const userRef = doc(db, `users/${userUID}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        return {
            succeded: false,
            errorCode: "Could not fetch user from database.",
        };
    }

    const user = userSnapshot.data();
    const projectRefs = user.projects;

    const projects = projectRefs.map(async (project) => {
        const projectSnapshot = await getDoc(project);
        return {
            uid: projectSnapshot.id,
            ...projectSnapshot.data(),
        };
    });

    return {
        succeded: true,
        projects: await Promise.all(projects),
    };
};

export const createProject = async (userUID, name, description) => {
    const projectsRef = collection(db, "projects");
    const userRef = doc(db, `users/${userUID}`);

    try {
        const project = await addDoc(projectsRef, {
            name,
            description,
            createdAt: Timestamp.now(),
            members: [userRef],
            tableCounter: 0,
        });

        updateDoc(userRef, {
            projects: arrayUnion(project),
        });

        return {
            succeded: true,
            project: {
                uid: project.id,
                ...(await getDoc(project)).data(),
            },
        };
    } catch (error) {
        return {
            succeded: false,
            errorCode:
                "Error creating project. Please try again or contact support.",
        };
    }
};

export const getFirebaseProjectData = async (projectUID) => {
    const projectRef = doc(db, `projects/${projectUID}`);
    const projectSnapshot = await getDoc(projectRef);

    if (!projectSnapshot.exists()) {
        return {
            succeded: false,
            errorCode: "Could not fetch project from database.",
        };
    }

    const project = projectSnapshot.data();
    return {
        succeded: true,
        project,
    };
};

export const subscribeToProject = async (projectUID, onChange) => {
    const projectRef = doc(db, `projects/${projectUID}`);
    const unsub = onSnapshot(projectRef, (doc) => {
        const data = doc.data();

        onChange(data);
    });

    return unsub;
};

export const updateProject = async (projectUID, data) => {
    const projectRef = doc(db, `projects/${projectUID}`);
    console.log(projectUID);

    try {
        await updateDoc(projectRef, data);

        console.log("Project updated successfully.");

        return { succeded: true };
    } catch (error) {
        console.log("Error updating project.");
        console.log(error);

        return {
            succeded: false,
            errorCode:
                "Error updating project. Please try again or contact support.",
        };
    }
};

export const getProjectMembers = async (projectId) => {
    const projectRef = doc(db, `projects/${projectId}`);
    const projectSnapshot = await getDoc(projectRef);

    if (!projectSnapshot.exists()) {
        return {
            succeded: false,
            errorCode: "Could not fetch project from database.",
        };
    }

    const project = projectSnapshot.data();
    const memberRefs = project.members;

    const members = memberRefs.map(async (member) => {
        const memberSnapshot = await getDoc(member);
        return {
            uid: memberSnapshot.id,
            ...memberSnapshot.data(),
        };
    });

    return {
        succeded: true,
        members: await Promise.all(members),
    };
};

export const inviteMemberToProject = async (projectId, email) => {
    const projectRef = doc(db, `projects/${projectId}`);
    const projectSnapshot = await getDoc(projectRef);
    if (!projectSnapshot.exists()) {
        return {
            succeded: false,
            errorCode: "Could not fetch project from database.",
        };
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const userSnapshots = await getDocs(q);

    if (userSnapshots.empty) {
        return {
            succeded: false,
            errorCode: "Could not fetch user from database.",
        };
    }

    let userRef;
    let user;
    userSnapshots.forEach(async (doc) => {
        userRef = doc.ref;
        user = {
            uid: doc.id,
            ...doc.data(),
        };
        return;
    });

    const project = projectSnapshot.data();
    const memberRefs = project.members;

    if (memberRefs.some((member) => member.id == userRef.id)) {
        return {
            succeded: false,
            errorCode: "User is already a member of the project.",
        };
    }

    try {
        await updateDoc(projectRef, {
            members: arrayUnion(userRef),
        });
    } catch (error) {
        console.log("AAAAAAAAAAAAA");
        console.log(error);

        return {
            succeded: false,
            errorCode:
                "Error adding user to project. Please try again or contact support.",
        };
    }

    try {
        await updateDoc(userRef, {
            projects: arrayUnion(projectRef),
        });

        return {
            succeded: true,
            user: {
                uid: userRef.id,
                ...user,
            },
        };
    } catch (error) {
        console.log("BBBBBBBB");
        console.log(error);

        // Rollback
        await updateDoc(projectRef, {
            members: arrayRemove(userRef),
        });

        return {
            succeded: false,
            errorCode:
                "Error adding project to user. Please try again or contact support.",
        };
    }
};

export const removeMemberFromProject = async (projectId, memberId) => {
    const projectRef = doc(db, `projects/${projectId}`);
    const projectSnapshot = await getDoc(projectRef);
    if (!projectSnapshot.exists()) {
        return {
            succeded: false,
            errorCode: "Could not fetch project from database.",
        };
    }

    const memberRef = doc(db, `users/${memberId}`);
    const memberSnapshot = await getDoc(memberRef);
    if (!memberSnapshot.exists()) {
        return {
            succeded: false,
            errorCode: "Could not fetch user from database.",
        };
    }

    const project = projectSnapshot.data();
    const memberRefs = project.members;

    if (!memberRefs.some((member) => member.id == memberRef.id)) {
        return {
            succeded: false,
            errorCode: "User is not a member of the project.",
        };
    }

    try {
        await updateDoc(projectRef, {
            members: arrayRemove(memberRef),
        });
    } catch (error) {
        return {
            succeded: false,
            errorCode:
                "Error removing user from project. Please try again or contact support.",
        };
    }

    try {
        await updateDoc(memberRef, {
            projects: arrayRemove(projectRef),
        });

        return {
            succeded: true,
        };
    } catch (error) {
        // Rollback
        await updateDoc(projectRef, {
            members: arrayUnion(memberRef),
        });

        return {
            succeded: false,
            errorCode:
                "Error removing user from project. Please try again or contact support.",
        };
    }
};
