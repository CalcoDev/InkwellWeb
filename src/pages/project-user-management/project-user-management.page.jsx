import { useRecoilState } from "recoil";
import projectState from "../../recoil/atoms/project-state.atom";
import ProjectPageContainer from "../../components/project-page-container/project-page-container.component";
import { useEffect, useState } from "react";
import InkInput from "../../components/ink-input/ink-input.component";
import InkButton from "../../components/ink-button/ink-button.component";
import { useNavigate } from "react-router-dom";
import {
    getProjectMembers,
    inviteMemberToProject,
    removeMemberFromProject,
} from "../../firebase/firebase.utility";
import UserDisplay from "../../components/user-display/user-display.component";

const ProjectUserManagement = () => {
    const [project, setProject] = useRecoilState(projectState);

    const [members, setMembers] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [error, setError] = useState(null);
    const [removeUserError, setRemoveUserError] = useState(null);

    const getUsers = async () => {
        const res = await getProjectMembers(project.uid);

        if (res.errorCode) {
            setError(res.errorMessage);
            return;
        }

        setMembers(res.members);
    };

    useEffect(() => {
        setTimeout(() => {
            getUsers();
        }, 1000);
    }, []);

    const handleInvite = async () => {
        const res = await inviteMemberToProject(project.uid, userEmail);

        if (res.errorCode) {
            setError(res.errorCode);
            return;
        }

        setError(null);
        setUserEmail("");

        setMembers([...members, res.user]);
        setProject({
            ...project,
            members: [...project.members, res.user],
        });
    };

    const navigate = useNavigate();
    const handleRefreshUsers = () => {
        navigate(0);
    };

    const handleGoBack = () => {
        navigate("/project/" + project.uid);
    };

    const handleRemoveUser = async (index) => {
        console.log("Removing user at index: ", index);

        const res = await removeMemberFromProject(
            project.uid,
            members[index].uid
        );
        if (res.errorCode) {
            setRemoveUserError(res.errorCode);
            return;
        }

        setRemoveUserError(null);
        setMembers(members.filter((_, i) => i !== index));
        setProject({
            ...project,
            members: project.members.filter((_, i) => i !== index),
        });
    };

    return (
        <ProjectPageContainer project={project}>
            <h1 className="text-ink-dark-light-blue font-ink-fira font-normal mb-2 text-xl">
                Users & Members
            </h1>

            <div className="mb-8">
                {members.map(({ email, displayName, photoURL }, i) => (
                    <UserDisplay
                        email={email}
                        username={displayName}
                        imgSrc={photoURL}
                        onRemove={() => handleRemoveUser(i)}
                        isOwner={i === 0}
                        key={i}
                    />
                ))}
            </div>

            {removeUserError && (
                <p className="text-ink-red text-xs text-center mb-4">
                    {removeUserError}
                </p>
            )}

            <div className="flex justify-center">
                <InkButton
                    className="mr-8"
                    lightTheme={false}
                    onClick={handleRefreshUsers}
                >
                    REFRESH USERS
                </InkButton>
            </div>

            <h1 className="text-ink-dark-light-blue font-ink-fira font-normal mb-2 text-xl">
                Invite new user
            </h1>

            <InkInput
                className="mb-8"
                label="Invitee Email"
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                lightTheme={false}
            />

            {error && (
                <p className="text-ink-red text-xs text-center mb-4">{error}</p>
            )}

            <div className="flex justify-center">
                <InkButton
                    className="mr-8"
                    lightTheme={false}
                    onClick={handleInvite}
                >
                    INVITE
                </InkButton>
                <InkButton lightTheme={false} onClick={handleGoBack}>
                    GO BACK
                </InkButton>
            </div>
        </ProjectPageContainer>
    );
};

export default ProjectUserManagement;
