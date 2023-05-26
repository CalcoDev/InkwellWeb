import { Bar, Container, Section } from "react-simple-resizer";
import SideDashboard from "../../../components/side-dashboard/side-dashboard.component";
import { useEffect, useState } from "react";
import InkInput from "../../../components/ink-input/ink-input.component";
import { useRecoilState } from "recoil";
import projectState from "../../../recoil/atoms/project-state.atom";
import TableEntry from "../../../components/table-entry/table-entry.component";
import InkModal from "../../../components/ink-modal/ink-modal.component";
import InkButton from "../../../components/ink-button/ink-button.component";
import {
    TEST_addFirebaseEntry,
    TEST_deleteFirebaseEntry,
    TEST_updateFirebaseEntry,
    createTable,
    deleteFirebaseEntryById,
    getFirebaseProjectData,
    loadFirebaseProjectToProjectState,
    removeTable,
} from "../../../firebase/firebase.utility";
import { useParams } from "react-router-dom";
import TableViewHeader from "../../../components/table-view-header/table-view-header.component";

const ProjectTableView = () => {
    const { projectId } = useParams();
    const [project, setProject] = useRecoilState(projectState);

    const [tablesFilter, setTablesFilter] = useState("");
    const [entriesFilter, setEntriesFilter] = useState("");

    const [filteredTables, setFilteredTables] = useState([]);
    const [filteredFacts, setFilteredFacts] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filteredRules, setFilteredRules] = useState([]);

    const [selectedTable, setSelectedTable] = useState(-1);
    const [selectedEntry, setSelectedEntry] = useState(-1);

    const [createEntryModalHidden, setCreateEntryModalHidden] = useState(true);
    const [entryType, setEntryType] = useState("");

    const [entryName, setEntryName] = useState("");
    const [entryValue, setEntryValue] = useState(0);

    const [selectedEntryType, setSelectedEntryType] = useState("fact"); // ["fact", "event", "rule"

    // TODO(calco): Implement auto-complete for fact and event entries.
    const [ruleTriggeredBy, setRuleTriggeredBy] = useState("");
    const [ruleTriggers, setRuleTriggers] = useState("");
    const [ruleCriteria, setRuleCriteria] = useState("");
    const [ruleModifications, setRuleModifications] = useState("");

    const [entryCreateType, setEntryCreateType] = useState("fact");

    // aaaaaaaaaaaaa
    const [editingEntryName, setEditingEntryName] = useState("");
    const [editingEntryValue, setEditingEntryValue] = useState(0);

    const [editingEntryTriggeredBy, setEditingEntryTriggeredBy] = useState("");
    const [editingEntryTriggers, setEditingEntryTriggers] = useState("");
    const [editingEntryCriteria, setEditingEntryCriteria] = useState("");
    const [editingEntryModifications, setEditingEntryModifications] =
        useState("");

    const ruleStringToArray = (str) => {
        return str.split(",").map((e) => e.trim());
    };

    const ruleArrayToString = (arr) => {
        return arr.join(", ");
    };

    const handleSaveChanges = async () => {
        console.log("SAVING CHANGES: ", editingEntryName, editingEntryValue);

        const e = project?.tables?.[selectedTable]?.[
            `${selectedEntryType}s`
        ]?.filter((entry) => entry.id === selectedEntry)[0];

        const entryType = selectedEntryType;
        const entryUid = e.uid;
        let entryData = {
            key: editingEntryName,
            value: editingEntryValue,
        };

        if (entryType === "rule") {
            entryData = {
                ...entryData,
                triggeredBy: ruleStringToArray(editingEntryTriggeredBy),
                triggers: ruleStringToArray(editingEntryTriggers),
                criteria: ruleStringToArray(editingEntryCriteria),
                modifications: ruleStringToArray(editingEntryModifications),
            };
        }

        console.log("ENTRY TYPE: ", entryType);
        console.log("ENTRY UID: ", entryUid);
        console.log("ENTRY DATA: ", entryData);

        const b = await TEST_updateFirebaseEntry(
            projectId,
            project.tables[selectedTable].uid,
            entryType,
            entryUid,
            entryData
        );
        console.log(b);

        await reloadProject();
    };

    useEffect(() => {
        if (project.local) return;

        reloadProject();
    }, []);

    useEffect(() => {
        setFilteredTables(
            project.tables
                .map((project, index) => ({
                    ...project,
                    index,
                }))
                .filter((table) =>
                    table.name
                        .toLowerCase()
                        .includes(tablesFilter.toLowerCase())
                )
        );
    }, [project, tablesFilter]);

    useEffect(() => {
        setSelectedEntry(-1);
        setSelectedEntryType("");

        setEditingEntryName("");
        setEditingEntryValue("");
    }, [selectedTable]);

    useEffect(() => {
        console.log("SELECTED ENTRY: ", selectedEntry);

        if (selectedEntry === -1) return;

        const e = project?.tables?.[selectedTable]?.[
            `${selectedEntryType}s`
        ]?.filter((entry) => entry.id === selectedEntry)[0];

        const k = e?.key;
        const v = e?.value;

        if (k === undefined || v === undefined) return;

        setEditingEntryName(k);
        setEditingEntryValue(v);

        if (selectedEntryType === "rule") {
            const tb = e?.triggeredBy;
            const tr = e?.triggers;
            const c = e?.criteria;
            const m = e?.modifications;

            if (
                tb === undefined ||
                tr === undefined ||
                c === undefined ||
                m === undefined
            )
                return;

            setEditingEntryTriggeredBy(ruleArrayToString(tb));
            setEditingEntryTriggers(ruleArrayToString(tr));
            setEditingEntryCriteria(ruleArrayToString(c));
            setEditingEntryModifications(ruleArrayToString(m));
        }
    }, [selectedEntry]);

    useEffect(() => {
        if (project.tables.length === 0) return;

        const facts = project?.tables?.[selectedTable]?.facts;
        const events = project?.tables?.[selectedTable]?.events;
        const rules = project?.tables?.[selectedTable]?.rules;

        if (facts === undefined || events === undefined || rules === undefined)
            return;

        const filteredFacts = facts
            .map((fact, index) => ({
                ...fact,
                index: fact.id,
            }))
            .filter((fact) =>
                fact.key.toLowerCase().includes(entriesFilter.toLowerCase())
            );

        const filteredEvents = events
            .map((event, index) => ({
                ...event,
                index: event.id,
            }))
            .filter((event) =>
                event.key.toLowerCase().includes(entriesFilter.toLowerCase())
            );

        const filteredRules = rules
            .map((rule, index) => ({
                ...rule,
                index: rule.id,
            }))
            .filter((rule) =>
                rule.key.toLowerCase().includes(entriesFilter.toLowerCase())
            );

        setFilteredFacts(filteredFacts);
        setFilteredEvents(filteredEvents);
        setFilteredRules(filteredRules);
    }, [project, selectedTable, entriesFilter]);

    const reloadProject = async () => {
        console.log("Trying to reload project: ", projectId);

        const r1 = await getFirebaseProjectData(projectId);
        if (!r1.succeded) {
            console.error("Failed to get project data from firebase!");
            return;
        }

        const r2 = await loadFirebaseProjectToProjectState(projectId);
        if (!r2.succeded) {
            console.error(
                "Failed to load project from firebase to project state!"
            );
            return;
        }

        const p = {
            local: false,
            uid: projectId,
            name: r1.project.name,
            createdAt: r1.project.createdAt,
            description: r1.project.description,
            tables: r2.project.tables,
        };

        setProject(p);
    };

    const handleCreateTable = async () => {
        console.log("CREATING TABLE: ", entryName);

        const res = await createTable(project.uid, entryName);
        if (res.errorCode) {
            console.error(res.errorCode);
            return;
        }

        setCreateEntryModalHidden(true);
        setEntryName("");

        console.log("CREATED TABLE: ");
        console.log(res.table);

        await reloadProject();
    };

    const handleRemoveTable = async () => {
        if (selectedTable === -1) return;

        console.log(project.tables[selectedTable].uid);

        await removeTable(project.uid, project.tables[selectedTable].uid);
        await reloadProject();

        setSelectedTable(-1);
    };

    const handleAddEntry = async () => {
        if (selectedEntry === -1) return;

        console.log("ADDING ENTRY: ", entryName);

        let entry = {
            key: entryName,
            value: entryValue,
        };

        if (entryCreateType === "rule") {
            entry = {
                ...entry,
                triggeredBy: ruleStringToArray(ruleTriggeredBy),
                triggers: ruleStringToArray(ruleTriggers),
                criteria: ruleStringToArray(ruleCriteria),
                modifications: ruleStringToArray(ruleModifications),
            };
        }

        const a = await TEST_addFirebaseEntry(
            projectId,
            project.tables[selectedTable].uid,
            entryCreateType,
            entry
        );
        console.log(a);

        await reloadProject();

        setEntriesFilter("");

        setCreateEntryModalHidden(true);
        setEntryName("");
        setEntryValue(0);
        setRuleTriggeredBy("");
        setRuleTriggers("");
        setRuleCriteria("");
        setRuleModifications("");
    };

    const handleRemoveEntry = async () => {
        console.log("REMOVING ENTRY: ", selectedEntry);

        await deleteFirebaseEntryById(
            projectId,
            project.tables[selectedTable].uid,
            selectedEntry
        );
        await reloadProject();
        setSelectedEntry(0);
    };

    return (
        <>
            <InkModal
                title={`Create ${entryType}`}
                setHidden={setCreateEntryModalHidden}
                hidden={createEntryModalHidden}
            >
                {entryType === "table" ? (
                    <div>
                        <InkInput
                            className="mb-8"
                            label="Table Name"
                            type="text"
                            value={entryName}
                            onChange={(e) => setEntryName(e.target.value)}
                            lightTheme={false}
                        />

                        <InkButton
                            lightTheme={false}
                            onClick={handleCreateTable}
                        >
                            CREATE TABLE
                        </InkButton>
                    </div>
                ) : entryType === "entry" ? (
                    <div className="w-1/2 mx-auto">
                        <div className="border-b p-2 border-ink-dark-grey max-w-[fit_content]">
                            <label htmlFor="entry-type">Entry Type: </label>
                            <select
                                className="p-2 outline-none"
                                value={entryCreateType}
                                onChange={(e) =>
                                    setEntryCreateType(e.target.value)
                                }
                            >
                                <option value="fact">Fact</option>
                                <option value="event">Event</option>
                                <option value="rule">Rule</option>
                            </select>
                        </div>

                        <div className="mt-12">
                            <InkInput
                                className="mb-8"
                                label="Entry Name"
                                type="text"
                                value={entryName}
                                onChange={(e) => setEntryName(e.target.value)}
                                lightTheme={false}
                            />

                            <InkInput
                                className="mb-8"
                                label="Entry Value"
                                type="number"
                                value={entryValue}
                                onChange={(e) => setEntryValue(e.target.value)}
                                lightTheme={false}
                            />

                            {entryCreateType === "rule" && (
                                <div>
                                    <p>
                                        Following values are all arrays, comma
                                        separated, specifying the name of the
                                        entries triggering.
                                        <br /> <br />
                                        <span className="font-semibold">
                                            Example: "event_1, fact_2, event_3"
                                        </span>
                                    </p>
                                    <InkInput
                                        className="mb-8 mt-2"
                                        label="Rule Triggered By"
                                        type="text"
                                        value={ruleTriggeredBy}
                                        onChange={(e) =>
                                            setRuleTriggeredBy(e.target.value)
                                        }
                                        lightTheme={false}
                                    />
                                    <InkInput
                                        className="mb-8"
                                        label="Rule Triggers"
                                        type="text"
                                        value={ruleTriggers}
                                        onChange={(e) =>
                                            setRuleTriggers(e.target.value)
                                        }
                                        lightTheme={false}
                                    />
                                    <div>
                                        <p className="font-bold">
                                            Rule Criteria
                                        </p>
                                        <p className="font-semibold">
                                            {`Example: "fact_1 > 20, fact_2 < 10"`}
                                        </p>
                                        <InkInput
                                            className="mb-8 mt-2"
                                            label="Rule Criteria"
                                            type="text"
                                            value={ruleCriteria}
                                            onChange={(e) =>
                                                setRuleCriteria(e.target.value)
                                            }
                                            lightTheme={false}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            Rule Modifications
                                        </p>
                                        <p className="font-semibold">
                                            {`Example: "fact_1 = 20, fact_2 += 1"`}
                                        </p>
                                        <InkInput
                                            className="mb-8 mt-2"
                                            label="Rule Modifications"
                                            type="text"
                                            value={ruleModifications}
                                            onChange={(e) =>
                                                setRuleModifications(
                                                    e.target.value
                                                )
                                            }
                                            lightTheme={false}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="w-ful flex justify-center">
                                <InkButton
                                    lightTheme={false}
                                    onClick={handleAddEntry}
                                >
                                    ADD ENTRY
                                </InkButton>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>ERROR</div>
                )}
            </InkModal>
            <div className="h-screen flex">
                <SideDashboard />

                <div className="w-full h-full bg-ink-red">
                    <Container className="h-full bg-ink-tables-mid-grey w-full">
                        <Section className="flex flex-col" minSize={100}>
                            <TableViewHeader
                                title="Tables"
                                filter={tablesFilter}
                                setFilter={setTablesFilter}
                                onClickAdd={() => {
                                    setEntryType("table");
                                    setCreateEntryModalHidden(false);
                                }}
                                onClickRemove={handleRemoveTable}
                            />

                            <div className="aaaaaaaa overflow-y-scroll">
                                {filteredTables.map((table, index) => (
                                    <TableEntry
                                        key={index}
                                        name={table.name}
                                        isSelected={
                                            table.index === selectedTable
                                        }
                                        onClick={() => {
                                            setSelectedTable(table.index);
                                            setSelectedEntryType("fact");
                                        }}
                                    />
                                ))}
                            </div>
                        </Section>
                        <Bar
                            size={2}
                            className="cursor-col-resize bg-ink-tables-dark-grey"
                        />
                        <Section className="" minSize={100}>
                            <TableViewHeader
                                title="Entries"
                                filter={entriesFilter}
                                setFilter={setEntriesFilter}
                                onClickAdd={() => {
                                    if (selectedTable === -1) return;

                                    setEntryType("entry");
                                    setCreateEntryModalHidden(false);
                                }}
                                onClickRemove={handleRemoveEntry}
                            />

                            <div className="bbbbbbb flex flex-col h-full">
                                <div className="flex-1 overflow-y-scroll border-t border-b border-ink-tables-dark-grey">
                                    <span className="px-2 text-ink-tables-lightest-grey">
                                        Facts
                                    </span>
                                    {filteredFacts.map((fact, index) => (
                                        <TableEntry
                                            key={index}
                                            name={fact.key}
                                            isSelected={
                                                fact.index === selectedEntry
                                            }
                                            onClick={() => {
                                                setSelectedEntry(fact.index);
                                                setSelectedEntryType("fact");
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-scroll border-t border-b border-ink-tables-dark-grey">
                                    <span className="px-2 text-ink-tables-lightest-grey">
                                        Events
                                    </span>
                                    {filteredEvents.map((event, index) => (
                                        <TableEntry
                                            key={index}
                                            name={event.key}
                                            isSelected={
                                                event.index === selectedEntry
                                            }
                                            onClick={() => {
                                                setSelectedEntry(event.index);
                                                setSelectedEntryType("event");
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-scroll border-t border-b border-ink-tables-dark-grey">
                                    <span className="px-2 text-ink-tables-lightest-grey">
                                        Rules
                                    </span>
                                    {filteredRules.map((rule, index) => (
                                        <TableEntry
                                            key={index}
                                            name={rule.key}
                                            isSelected={
                                                rule.index === selectedEntry
                                            }
                                            onClick={() => {
                                                setSelectedEntry(rule.index);
                                                setSelectedEntryType("rule");
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Section>
                        <Bar
                            size={2}
                            className="cursor-col-resize bg-ink-tables-dark-grey"
                        />
                        <Section className="" minSize={100}>
                            <div className="bg-ink-tables-dark-grey w-full h-16 flex justify-center items-center p-4">
                                <p className="text-ink-tables-light-grey font-ink-catamaran text-lg flex-[1]">
                                    {project?.tables?.[selectedTable]?.name}/
                                    {selectedEntryType &&
                                        `${selectedEntryType}s/`}
                                    {
                                        project?.tables?.[selectedTable]?.[
                                            `${selectedEntryType}s`
                                        ]?.filter(
                                            (entry) =>
                                                entry.id === selectedEntry
                                        )?.[0]?.key
                                    }
                                </p>
                            </div>

                            <div className="bbbbbbb overflow-y-scroll h-full flex flex-col py-4">
                                <InkInput
                                    className="mb-8"
                                    label="New Name"
                                    type="text"
                                    value={editingEntryName}
                                    onChange={(e) =>
                                        setEditingEntryName(e.target.value)
                                    }
                                />
                                <InkInput
                                    className="mb-8"
                                    label="New Value"
                                    type="number"
                                    value={editingEntryValue}
                                    onChange={(e) =>
                                        setEditingEntryValue(e.target.value)
                                    }
                                />

                                {selectedEntryType === "rule" && (
                                    <div className="text-ink-light-grey">
                                        <p>
                                            Following values are all arrays,
                                            comma separated, specifying the name
                                            of the entries triggering.
                                            <br /> <br />
                                            <span className="text-ink-tables-lightest-grey font-semibold">
                                                Example: "event_1, fact_2,
                                                event_3"
                                            </span>
                                        </p>
                                        <InkInput
                                            className="mb-8 mt-2"
                                            label="Rule Triggered By"
                                            type="text"
                                            value={editingEntryTriggeredBy}
                                            onChange={(e) =>
                                                setEditingEntryTriggeredBy(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InkInput
                                            className="mb-8"
                                            label="Rule Triggers"
                                            type="text"
                                            value={editingEntryTriggers}
                                            onChange={(e) =>
                                                setEditingEntryTriggers(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div>
                                            <p className="font-bold">
                                                Rule Criteria
                                            </p>
                                            <p className="text-ink-tables-lightest-grey font-semibold">
                                                {`Example: "fact_1 > 20, fact_2 < 10"`}
                                            </p>
                                            <InkInput
                                                className="mb-8 mt-2"
                                                label="Rule Criteria"
                                                type="text"
                                                value={editingEntryCriteria}
                                                onChange={(e) =>
                                                    setEditingEntryCriteria(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                Rule Modifications
                                            </p>
                                            <p className="text-ink-tables-lightest-grey font-semibold">
                                                {`Example: "fact_1 = 20, fact_2 += 1"`}
                                            </p>
                                            <InkInput
                                                className="mb-8 mt-2"
                                                label="Rule Modifications"
                                                type="text"
                                                value={
                                                    editingEntryModifications
                                                }
                                                onChange={(e) =>
                                                    setEditingEntryModifications(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="w-full flex justify-center">
                                    <InkButton onClick={handleSaveChanges}>
                                        SAVE CHANGES
                                    </InkButton>
                                </div>
                            </div>
                        </Section>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default ProjectTableView;
