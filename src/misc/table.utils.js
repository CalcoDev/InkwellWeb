export const checkProjectValidity = (project) => {
    const hasName = project.hasOwnProperty("name");
    const hasDescription = project.hasOwnProperty("description");
    const hasTables = project.hasOwnProperty("tables");

    if (!hasName || !hasDescription || !hasTables)
        return [false, "Missing name, description or tables."];

    // Check if tables is an array
    if (!Array.isArray(project.tables))
        return [false, "Tables is not an array."];

    // Check all tables
    for (const table of project.tables) {
        const [isValid, errorMessage] = checkTableValidity(table);
        if (!isValid) return [false, errorMessage];
    }

    return [true];
};

const checkTableValidity = (table) => {
    const hasId = table.hasOwnProperty("id");
    const hasKey = table.hasOwnProperty("key");
    const hasFacts = table.hasOwnProperty("facts");
    const hasEvents = table.hasOwnProperty("events");
    const hasRules = table.hasOwnProperty("rules");

    if (!hasId || !hasKey || !hasFacts || !hasEvents || !hasRules)
        return [
            false,
            "A table is missing an id, key, facts, events or rules.",
        ];

    // Check if facts is an array
    if (!Array.isArray(table.facts)) return [false, "Facts is not an array."];

    // Check if events is an array
    if (!Array.isArray(table.events)) return [false, "Events is not an array."];

    // Check if rules is an array
    if (!Array.isArray(table.rules)) return [false, "Rules is not an array."];

    // Check all facts
    for (const fact of table.facts) {
        const [isValid, errorMessage] = checkFactValidity(fact);
        if (!isValid) return [false, errorMessage];
    }

    // Check all events
    for (const event of table.events) {
        const [isValid, errorMessage] = checkEventValidity(event);
        if (!isValid) return [false, errorMessage];
    }

    // Check all rules
    for (const rule of table.rules) {
        const [isValid, errorMessage] = checkRuleValidity(rule);
        if (!isValid) return [false, errorMessage];
    }

    return [true];
};

export const checkEntryValidity = (entryType, entryData, extraBool) => {
    if (extraBool)
        return [true, "This is a temporary fix for a bug that I can't find."];

    const res = checkEntryTypeValidity(entryType);
    if (!res.succeded) return [false, res.errorCode];

    if (entryType === "fact") return checkFactValidity(entryData);
    if (entryType === "event") return checkEventValidity(entryData);
    if (entryType === "rule") return checkRuleValidity(entryData);

    return [false, "How tf did we get here?"];
};

export const checkEntryTypeValidity = (entryType) => {
    if (entryType !== "fact" && entryType !== "event" && entryType !== "rule") {
        return {
            succeded: false,
            errorCode: "Invalid entry type.",
        };
    }

    return {
        succeded: true,
    };
};

const checkFactValidity = (fact) => {
    const hasId = fact.hasOwnProperty("id");
    const hasKey = fact.hasOwnProperty("key");
    const hasData = fact.hasOwnProperty("data");

    if (!hasId || !hasKey || !hasData)
        return [false, "A fact is missing an id, key or data."];

    return [true];
};

const checkEventValidity = (event) => {
    const hasId = event.hasOwnProperty("id");
    const hasKey = event.hasOwnProperty("key");

    if (!hasId || !hasKey) return [false, "An event is missing an id or key."];

    return [true];
};

const checkRuleValidity = (rule) => {
    const hasId = rule.hasOwnProperty("id");
    const hasKey = rule.hasOwnProperty("key");
    const hasTriggeredBy = rule.hasOwnProperty("triggeredBy");
    const hasTriggers = rule.hasOwnProperty("triggers");
    const hasCriteria = rule.hasOwnProperty("criteria");
    const hasModifications = rule.hasOwnProperty("modifications");

    if (
        !hasId ||
        !hasKey ||
        !hasTriggeredBy ||
        !hasTriggers ||
        !hasCriteria ||
        !hasModifications
    )
        return [
            false,
            "A rule is missing an id, key, triggeredBy, triggers, criteria or modifications.",
        ];

    // Check if triggers is an array
    if (!Array.isArray(rule.triggers))
        return [false, "Triggers is not an array."];

    // Check if criteria is an array
    if (!Array.isArray(rule.criteria))
        return [false, "Criteria is not an array."];

    // Check if modifications is an array
    if (!Array.isArray(rule.modifications))
        return [false, "Modifications is not an array."];

    // Check all criteria
    for (const criterion of rule.criteria) {
        const [isValid, errorMessage] = checkCriterionValidity(criterion);
        if (!isValid) return [false, errorMessage];
    }

    // Check all modifications
    for (const modification of rule.modifications) {
        const [isValid, errorMessage] = checkModificationValidity(modification);
        if (!isValid) return [false, errorMessage];
    }

    return [true];
};

const checkCriterionValidity = (criterion) => {
    const hasComparedEntry = criterion.hasOwnProperty("comparedEntry");
    const hasCompareValue = criterion.hasOwnProperty("compareValue");
    const hasComparisonOperator =
        criterion.hasOwnProperty("comparisonOperator");

    if (!hasComparedEntry || !hasCompareValue || !hasComparisonOperator)
        return [
            false,
            "A criterion is missing a comparedEntry, compareValue or comparisonOperator.",
        ];

    return [true];
};

const checkModificationValidity = (modification) => {
    const hasEntry = modification.hasOwnProperty("entry");
    const hasModificationOperator = modification.hasOwnProperty(
        "modificationOperator"
    );
    const hasValue = modification.hasOwnProperty("value");

    if (!hasEntry || !hasModificationOperator || !hasValue)
        return [
            false,
            "A modification is missing an entry, modificationOperator or value.",
        ];

    return [true];
};

const checkCriterionOperatorValidity = (criterionOperator) => {
    const isValid =
        Object.values(CriterionOperator).includes(criterionOperator);

    if (!isValid) return [false, "A criterion operator is invalid."];

    return [true];
};

const checkModificationOperatorValidity = (modificationOperator) => {
    const isValid =
        Object.values(ModificationOperator).includes(modificationOperator);

    if (!isValid) return [false, "A modification operator is invalid."];

    return [true];
};

const CriterionOperator = {
    EQUALS: "EQUALS",
    NOT_EQUALS: "NOT_EQUALS",
    GREATER_THAN: "GREATER_THAN",
    LESS_THAN: "LESS_THAN",
    GREATER_THAN_OR_EQUAL_TO: "GREATER_THAN_OR_EQUAL_TO",
    LESS_THAN_OR_EQUAL_TO: "LESS_THAN_OR_EQUAL_TO",
};

const ModificationOperator = {
    SET: "SET",
    INCREMENT: "INCREMENT",
};
