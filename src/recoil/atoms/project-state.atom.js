import { atom } from "recoil";

/*
PROJECT: uid: string - name
    name: string
    description: string
    createdAt: Date
    members: [User]
    
    tables: [Table]
*/

/*
TABLE:
    id: int
    key: string
    facts: [Fact]
    events: [Event]
    rules: [Rule]
    
FACT:
    id: int
    key: string
    data: string

EVENT:
    id: int
    key: string
    
RULE:
    id: int
    key: string
    triggeredBy: [Event]
    triggers: [Event]
    criteria: [Criterion]
    modifications: [Modification]

CRITERION:
    comparedEntry: Entry-ID,
    compareValue: int,
    comparisonOperator: [CriterionOperator]

MODIFICATION:
    entry: Entry-ID,
    modificationOperator: [ModificationOperator],
    value: int
    
CRITERION_OPERATOR:
    EQUALS
    NOT_EQUALS
    GREATER_THAN
    LESS_THAN
    GREATER_THAN_OR_EQUAL_TO
    LESS_THAN_OR_EQUAL_TO

MODIFICATION_OPERATOR:
    SET
    INCREMENT
*/

const projectState = atom({
    key: "projectState",
    default: {
        uid: "",
        local: true,

        name: "",
        description: "",
        createdAt: "",
        members: [],
        tables: [],
    },
});

export default projectState;
