import { motion } from "motion/react";
import { useForm, FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import logoImage from "@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png";
import { LynxAPISchema, type LynxAPIValues } from "@/lib/schemas/LynxAPISchema";

const LYNX_RIGHTS = [
  { key: "viewOnly", label: "View only" },
  { key: "transfer", label: "Transfer of crypto assets and FIAT" },
  { key: "trading", label: "Trading rights" },
  { key: "staking", label: "Staking rights" },
];

const API_RIGHTS = [
  { key: "viewOnly", label: "View only via REST API" },
  { key: "whitelist", label: "Requesting whitelisting of wallet address via REST API" },
  { key: "transfer", label: "Instruct transfer of crypto assets and FIAT via REST API" },
  { key: "tradingRest", label: "Trading rights via REST API" },
  { key: "stakingRest", label: "Staking rights via REST API" },
  { key: "tradingFix", label: "Trading rights via FIX API" },
];

export function LynxAPIForm() {
  const form = useForm<LynxAPIValues>({
    defaultValues: {
      addLynxPersons: [],
      updateLynxPersons: [],
      removeLynxPersons: [],
      addAPIPersons: [],
      updateAPIPersons: [],
      removeAPIPersons: [],
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: LynxAPISchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

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
            className="h-16"
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="px-8 pt-8 pb-8"
        >
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

            <form.Field
              name="addLynxPersons"
              mode="array"
              children={(field) => (
                <RightsTable
                  title="Add"
                  field={field}
                  rightsConfig={LYNX_RIGHTS}
                  form={form}
                />
              )}
            />
            <form.Field
              name="updateLynxPersons"
              mode="array"
              children={(field) => (
                <RightsTable
                  title="Update"
                  field={field}
                  rightsConfig={LYNX_RIGHTS}
                  form={form}
                />
              )}
            />
            <form.Field
              name="removeLynxPersons"
              mode="array"
              children={(field) => (
                <RightsTable
                  title="Remove"
                  field={field}
                  rightsConfig={LYNX_RIGHTS}
                  form={form}
                />
              )}
            />
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

            <form.Field
              name="addAPIPersons"
              mode="array"
              children={(field) => (
                <RightsTable
                  title="Add"
                  field={field}
                  rightsConfig={API_RIGHTS}
                  form={form}
                />
              )}
            />
            <form.Field
              name="updateAPIPersons"
              mode="array"
              children={(field) => (
                <RightsTable
                  title="Update"
                  field={field}
                  rightsConfig={API_RIGHTS}
                  form={form}
                />
              )}
            />
            <form.Field
              name="removeAPIPersons"
              mode="array"
              children={(field) => (
                <RightsTable
                  title="Remove"
                  field={field}
                  rightsConfig={API_RIGHTS}
                  form={form}
                />
              )}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface RightsTableProps {
  title: string;
  field: FieldApi<LynxAPIValues, any, any, any>;
  rightsConfig: { key: string; label: string }[];
  form: any;
}

function RightsTable({ title, field, rightsConfig, form }: RightsTableProps) {
  const handleCheckboxChange = (
    index: number,
    rightKey: string,
    checked: boolean
  ) => {
    const rightsPath = `${field.name}[${index}].rights`;

    if (rightKey === "viewOnly") {
      if (checked) {
        // If View Only is selected, deselect others
        rightsConfig.forEach(right => {
          if (right.key !== "viewOnly") {
            form.setFieldValue(`${rightsPath}.${right.key}` as any, false);
          }
        });
        form.setFieldValue(`${rightsPath}.viewOnly` as any, true);
      } else {
        form.setFieldValue(`${rightsPath}.viewOnly` as any, false);
      }
    } else {
      if (checked) {
        // If any other is selected, deselect View Only
        form.setFieldValue(`${rightsPath}.viewOnly` as any, false);
        form.setFieldValue(`${rightsPath}.${rightKey}` as any, true);
      } else {
        form.setFieldValue(`${rightsPath}.${rightKey}` as any, false);
      }
    }
  };

  const createNewItem = () => {
    const baseItem = {
      id: `${field.name}-${Date.now()}`,
      name: "",
      firstname: "",
      email: "",
      phone: "",
    };

    const rights = rightsConfig.reduce((acc, right) => {
      acc[right.key] = false;
      return acc;
    }, {} as any);

    return { ...baseItem, rights };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-4 flex-1">
          <h3 className="text-base font-normal text-gray-900">
            {title}
          </h3>
          {title === "Add" && field.state.value.length > 0 && (
            <div className="flex flex-col flex-end gap-3 text-xs text-gray-600">
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => field.pushValue(createNewItem())}
          className="hover:bg-gray-100 p-1"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {field.state.value.length > 0 && (
        <div className="overflow-y-visible">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1 px-2 font-semibold text-xs">Name</th>
                <th className="text-left py-1 px-2 font-semibold text-xs">First Name</th>
                <th className="text-left py-1 px-2 font-semibold text-xs">E-Mail Address</th>
                <th className="text-left py-1 px-2 font-semibold text-xs">Phone Number</th>
                <>
                  {rightsConfig.map((right, index) => (
                    <th key={index} className={`relative align-bottom pb-2`}>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center py-2 px-2 font-semibold text-xs w-12">
                        <div className="group relative inline-block">
                          <span
                            className="text-xs font-semibold text-gray-300 hover:text-gray-800 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap cursor-help"
                          >
                            {right.label.length > 18 ? `${right.label.substring(0, 15)}...` : right.label}
                          </span>
                          <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 shadow-lg">
                            {right.label}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {field.state.value.map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <form.Field
                      name={`${field.name}[${index}].name`}
                      children={(subField) => (
                        <Input
                          value={subField.state.value}
                          onBlur={subField.handleBlur}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          className="border-gray-300 h-8 text-xs"
                          placeholder="Last Name"
                        />
                      )}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <form.Field
                      name={`${field.name}[${index}].firstname`}
                      children={(subField) => (
                        <Input
                          value={subField.state.value}
                          onBlur={subField.handleBlur}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          className="border-gray-300 h-8 text-xs"
                          placeholder="First Name"
                        />
                      )}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <form.Field
                      name={`${field.name}[${index}].email`}
                      children={(subField) => (
                        <div>
                          <Input
                            type="email"
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            className="border-gray-300 h-8 text-xs"
                            placeholder="email@example.com"
                          />
                          {subField.state.meta.errors ? (
                            <p className="text-red-500 text-xs mt-1">
                              {subField.state.meta.errors.join(', ')}
                            </p>
                          ) : null}
                        </div>
                      )}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <form.Field
                      name={`${field.name}[${index}].phone`}
                      children={(subField) => (
                        <div>
                          <Input
                            type="tel"
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            className="border-gray-300 h-8 text-xs"
                            placeholder="+1234567890"
                          />
                          {subField.state.meta.errors ? (
                            <p className="text-red-500 text-xs mt-1">
                              {subField.state.meta.errors.join(', ')}
                            </p>
                          ) : null}
                        </div>
                      )}
                    />
                  </td>
                  {rightsConfig.map((right) => (
                    <td key={right.key} className="py-2 px-2 text-center">
                      <form.Field
                        name={`${field.name}[${index}].rights.${right.key}`}
                        children={(subField) => (
                          <Checkbox
                            checked={subField.state.value as boolean}
                            onCheckedChange={(checked) => handleCheckboxChange(index, right.key, checked as boolean)}
                          />
                        )}
                      />
                    </td>
                  ))}
                  <td className="py-2 px-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.removeValue(index)}
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
}
