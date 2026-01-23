import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';

interface LynxPersonRow {
  id: string;
  name: string;
  firstname: string;
  email: string;
  phone: string;
  rights: {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
  };
}

interface APIPersonRow {
  id: string;
  name: string;
  firstname: string;
  email: string;
  phone: string;
  rights: {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
  };
}

export function LynxAPIForm() {
  // Lynx Persons
  const [addLynxPersons, setAddLynxPersons] = useState<
    LynxPersonRow[]
  >([]);
  const [updateLynxPersons, setUpdateLynxPersons] = useState<
    LynxPersonRow[]
  >([]);
  const [removeLynxPersons, setRemoveLynxPersons] = useState<
    LynxPersonRow[]
  >([]);

  // API Persons
  const [addAPIPersons, setAddAPIPersons] = useState<
    APIPersonRow[]
  >([]);
  const [updateAPIPersons, setUpdateAPIPersons] = useState<
    APIPersonRow[]
  >([]);
  const [removeAPIPersons, setRemoveAPIPersons] = useState<
    APIPersonRow[]
  >([]);

  // Lynx Person Handlers
  const handleLynxPersonChange = (
    section: "add" | "update" | "remove",
    id: string,
    field: keyof Omit<LynxPersonRow, "rights">,
    value: string,
  ) => {
    const setter =
      section === "add"
        ? setAddLynxPersons
        : section === "update"
          ? setUpdateLynxPersons
          : setRemoveLynxPersons;

    setter((prev) =>
      prev.map((person) =>
        person.id === id
          ? { ...person, [field]: value }
          : person,
      ),
    );
  };

  const handleLynxRightChange = (
    section: "add" | "update" | "remove",
    id: string,
    right: 1 | 2 | 3 | 4,
  ) => {
    const setter =
      section === "add"
        ? setAddLynxPersons
        : section === "update"
          ? setUpdateLynxPersons
          : setRemoveLynxPersons;

    setter((prev) =>
      prev.map((person) => {
        if (person.id !== id) return person;

        const currentValue = person.rights[right];
        const newRights = { ...person.rights };

        if (right === 1) {
          // Clicking checkbox 1
          if (!currentValue) {
            // Selecting checkbox 1 clears all others
            newRights[1] = true;
            newRights[2] = false;
            newRights[3] = false;
            newRights[4] = false;
          } else {
            // Deselecting checkbox 1
            newRights[1] = false;
          }
        } else {
          // Clicking checkboxes 2, 3, or 4
          if (!currentValue) {
            // Selecting any of 2-4 clears checkbox 1
            newRights[1] = false;
            newRights[right] = true;
          } else {
            // Deselecting checkbox 2, 3, or 4
            newRights[right] = false;
          }
        }

        return { ...person, rights: newRights };
      }),
    );
  };

  const addLynxPerson = (
    section: "add" | "update" | "remove",
  ) => {
    const setter =
      section === "add"
        ? setAddLynxPersons
        : section === "update"
          ? setUpdateLynxPersons
          : setRemoveLynxPersons;
    const list =
      section === "add"
        ? addLynxPersons
        : section === "update"
          ? updateLynxPersons
          : removeLynxPersons;

    const newId = `lynx-${section}-${list.length + 1}-${Date.now()}`;
    setter((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        firstname: "",
        email: "",
        phone: "",
        rights: { 1: false, 2: false, 3: false, 4: false },
      },
    ]);
  };

  const removeLynxPerson = (
    section: "add" | "update" | "remove",
    id: string,
  ) => {
    const setter =
      section === "add"
        ? setAddLynxPersons
        : section === "update"
          ? setUpdateLynxPersons
          : setRemoveLynxPersons;
    setter((prev) => prev.filter((person) => person.id !== id));
  };

  // API Person Handlers
  const handleAPIPersonChange = (
    section: "add" | "update" | "remove",
    id: string,
    field: keyof Omit<APIPersonRow, "rights">,
    value: string,
  ) => {
    const setter =
      section === "add"
        ? setAddAPIPersons
        : section === "update"
          ? setUpdateAPIPersons
          : setRemoveAPIPersons;

    setter((prev) =>
      prev.map((person) =>
        person.id === id
          ? { ...person, [field]: value }
          : person,
      ),
    );
  };

  const handleAPIRightChange = (
    section: "add" | "update" | "remove",
    id: string,
    right: 1 | 2 | 3 | 4 | 5 | 6,
  ) => {
    const setter =
      section === "add"
        ? setAddAPIPersons
        : section === "update"
          ? setUpdateAPIPersons
          : setRemoveAPIPersons;

    setter((prev) =>
      prev.map((person) => {
        if (person.id !== id) return person;

        const currentValue = person.rights[right];
        const newRights = { ...person.rights };

        if (right === 1) {
          // Clicking checkbox 1
          if (!currentValue) {
            // Selecting checkbox 1 clears all others
            newRights[1] = true;
            newRights[2] = false;
            newRights[3] = false;
            newRights[4] = false;
            newRights[5] = false;
            newRights[6] = false;
          } else {
            // Deselecting checkbox 1
            newRights[1] = false;
          }
        } else {
          // Clicking checkboxes 2-6
          if (!currentValue) {
            // Selecting any of 2-6 clears checkbox 1
            newRights[1] = false;
            newRights[right] = true;
          } else {
            // Deselecting checkbox 2-6
            newRights[right] = false;
          }
        }

        return { ...person, rights: newRights };
      }),
    );
  };

  const addAPIPerson = (
    section: "add" | "update" | "remove",
  ) => {
    const setter =
      section === "add"
        ? setAddAPIPersons
        : section === "update"
          ? setUpdateAPIPersons
          : setRemoveAPIPersons;
    const list =
      section === "add"
        ? addAPIPersons
        : section === "update"
          ? updateAPIPersons
          : removeAPIPersons;

    const newId = `api-${section}-${list.length + 1}-${Date.now()}`;
    setter((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        firstname: "",
        email: "",
        phone: "",
        rights: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
        },
      },
    ]);
  };

  const removeAPIPerson = (
    section: "add" | "update" | "remove",
    id: string,
  ) => {
    const setter =
      section === "add"
        ? setAddAPIPersons
        : section === "update"
          ? setUpdateAPIPersons
          : setRemoveAPIPersons;
    setter((prev) => prev.filter((person) => person.id !== id));
  };

  // Render Lynx Section
  const renderLynxSection = (
    title: string,
    section: "add" | "update" | "remove",
    persons: LynxPersonRow[],
  ) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-4 flex-1">
          <h3 className="text-base font-normal text-gray-900">
            {title}
          </h3>
          {section === "add" && persons.length > 0 && (
            <div className="flex flex-col flex-end gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span>View only</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Transfer of crypto assets and FIAT</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Trading rights</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Staking rights</span>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addLynxPerson(section)}
          className="hover:bg-gray-100 p-1"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {persons.length > 0 && (
        <div className="overflow-y-visible">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  Name
                </th>
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  First Name
                </th>
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  E-Mail Address
                </th>
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  Phone Number
                </th>
                {section === "add" ? (
                  <>

                    {  
                    Array.from({ length: 4 }).map((_, index) => (
                      <th key={index} className="relative">
                        <div className="absolute -rotate-90 whitespace-nowrap -top-4 left-1/2 -translate-x-1/2 text-center py-2 px-2 font-semibold text-xs w-16">
                          <span>  &lt; View only</span>
                        </div>
                      </th>
                    ))
                    } 
                    {
                      /*
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      1
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      2
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      3
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      4
                    </th>
                   */ }  
                  </>
                ) : (
                  <>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                  </>
                )}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr
                  key={person.id}
                  className="border-b border-gray-100"
                >
                  <td className="py-2 px-2">
                    <Input
                      value={person.name}
                      onChange={(e) =>
                        handleLynxPersonChange(
                          section,
                          person.id,
                          "name",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="Last Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={person.firstname}
                      onChange={(e) =>
                        handleLynxPersonChange(
                          section,
                          person.id,
                          "firstname",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="First Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="email"
                      value={person.email}
                      onChange={(e) =>
                        handleLynxPersonChange(
                          section,
                          person.id,
                          "email",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="email@example.com"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="tel"
                      value={person.phone}
                      onChange={(e) =>
                        handleLynxPersonChange(
                          section,
                          person.id,
                          "phone",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="+1234567890"
                    />
                  </td>
                  {[1, 2, 3, 4].map((right) => {
                    const rightNum = right as 1 | 2 | 3 | 4;

                    return (
                      <td
                        key={right}
                        className="py-2 px-2 text-center"
                      >
                        <Checkbox
                          checked={person.rights[rightNum]}
                          onCheckedChange={() =>
                            handleLynxRightChange(
                              section,
                              person.id,
                              rightNum,
                            )
                          }
                        />
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeLynxPerson(section, person.id)
                      }
                      className="hover:bg-gray-100 p-1"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Render API Section
  const renderAPISection = (
    title: string,
    section: "add" | "update" | "remove",
    persons: APIPersonRow[],
  ) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-4 flex-1">
          <h3 className="text-base font-normal text-gray-900">
            {title}
          </h3>
          {section === "add" && persons.length > 0 && (
            <div className="flex flex-col flex-end gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span>View only via REST API</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Requesting whitelisting of wallet address</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Instruct transfer of crypto assets and FIAT</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Trading rights via REST API</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Staking rights via REST API</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Trading rights via FIX API</span>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addAPIPerson(section)}
          className="hover:bg-gray-100 p-1"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {persons.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  Name
                </th>
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  First Name
                </th>
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  E-Mail Address
                </th>
                <th className="text-left py-2 px-2 font-semibold text-xs">
                  Phone Number
                </th>
                {section === "add" ? (
                  <>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      1
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      2
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      3
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      4
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      5
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16">
                      6
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    <th className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                  </>
                )}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr
                  key={person.id}
                  className="border-b border-gray-100"
                >
                  <td className="py-2 px-2">
                    <Input
                      value={person.name}
                      onChange={(e) =>
                        handleAPIPersonChange(
                          section,
                          person.id,
                          "name",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="Last Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={person.firstname}
                      onChange={(e) =>
                        handleAPIPersonChange(
                          section,
                          person.id,
                          "firstname",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="First Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="email"
                      value={person.email}
                      onChange={(e) =>
                        handleAPIPersonChange(
                          section,
                          person.id,
                          "email",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="email@example.com"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="tel"
                      value={person.phone}
                      onChange={(e) =>
                        handleAPIPersonChange(
                          section,
                          person.id,
                          "phone",
                          e.target.value,
                        )
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="+1234567890"
                    />
                  </td>
                  {[1, 2, 3, 4, 5, 6].map((right) => {
                    const rightNum = right as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                      | 6;

                    return (
                      <td
                        key={right}
                        className="py-2 px-2 text-center"
                      >
                        <Checkbox
                          checked={person.rights[rightNum]}
                          onCheckedChange={() =>
                            handleAPIRightChange(
                              section,
                              person.id,
                              rightNum,
                            )
                          }
                        />
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeAPIPerson(section, person.id)
                      }
                      className="hover:bg-gray-100 p-1"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper lynx-api-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10">
          <img
            src={logoImage}
            alt="Crypto Finance"
            className="h-10"
          />
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6">
          <h1
            className="text-3xl tracking-wider mb-1 text-gray-900"
            style={{ letterSpacing: "0.15em" }}
          >
            LYNX & API ACCESS
          </h1>
          <p className="text-sm text-gray-600">
            Crypto Finance AG - A Deutsche Börse Group Company
          </p>
        </div>

        {/* Form Content */}
        <div className="px-8 pt-8 pb-8">
          {/* Section 3: Lynx User Interface */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              3 Authorized Persons – to use Lynx User Interface
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              The person(s) listed below are authorized,
              individually and never jointly, to perform actions
              via the User Interface Lynx - only within the
              scope of the rights explicitly granted by
              selecting one or more of the following:
            </p>
            <ol className="list-decimal ml-6 space-y-1 text-sm text-gray-700 mb-6">
              <li>View only</li>
              <li>Transfer of crypto assets and FIAT</li>
              <li>Trading rights</li>
              <li>Staking rights</li>
            </ol>

            {/* Lynx Add Section */}
            {renderLynxSection("Add", "add", addLynxPersons)}

            {/* Lynx Update Section */}
            {renderLynxSection(
              "Update",
              "update",
              updateLynxPersons,
            )}

            {/* Lynx Remove Section */}
            {renderLynxSection(
              "Remove",
              "remove",
              removeLynxPersons,
            )}
          </div>

          {/* Section 4: API Portal Access Rights */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              4 API Portal Access Rights
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              The Client designates the below persons as API
              users with the numerically indicated rights.
            </p>
            <div className="grid grid-cols-2 gap-x-8 mb-6">
              <ol className="list-decimal ml-6 space-y-1 text-sm text-gray-700">
                <li>View only via REST API</li>
                <li>
                  Requesting the whitelisting of wallet address
                  via REST API
                </li>
                <li>
                  Instruct the transfer out of crypto assets and
                  FIAT via REST API
                </li>
              </ol>
              <ol
                className="list-decimal ml-6 space-y-1 text-sm text-gray-700"
                start={4}
              >
                <li>Trading rights via REST API</li>
                <li>Staking rights via REST API</li>
                <li>Trading rights via FIX API</li>
              </ol>
            </div>

            {/* API Add Section */}
            {renderAPISection("Add", "add", addAPIPersons)}

            {/* API Update Section */}
            {renderAPISection(
              "Update",
              "update",
              updateAPIPersons,
            )}

            {/* API Remove Section */}
            {renderAPISection(
              "Remove",
              "remove",
              removeAPIPersons,
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t bg-white">
          <p className="text-xs text-gray-600">
            Crypto Finance AG
            <br />
            Authorized Persons | 01/10/2025
          </p>
        </div>
      </motion.div>
    </div>
  );
}