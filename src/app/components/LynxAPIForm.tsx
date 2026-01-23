import { motion } from "motion/react";
import { useForm, useFieldArray, Control, Controller, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LynxAPIValues>({
    resolver: zodResolver(LynxAPISchema),
    defaultValues: {
      addLynxPersons: [],
      updateLynxPersons: [],
      removeLynxPersons: [],
      addAPIPersons: [],
      updateAPIPersons: [],
      removeAPIPersons: [],
    },
    mode: "onBlur",
  });

  const onSubmit = (data: LynxAPIValues) => {
    console.log("Form submitted:", data);
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-8 pb-8">
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

            <RightsTable 
              title="Add" 
              name="addLynxPersons" 
              control={control} 
              register={register} 
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              rightsConfig={LYNX_RIGHTS}
              headerHeightClass="h-32"
            />
            <RightsTable 
              title="Update" 
              name="updateLynxPersons" 
              control={control} 
              register={register} 
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              rightsConfig={LYNX_RIGHTS}
              headerHeightClass="h-32"
            />
            <RightsTable 
              title="Remove" 
              name="removeLynxPersons" 
              control={control} 
              register={register} 
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              rightsConfig={LYNX_RIGHTS}
              headerHeightClass="h-32"
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

            <RightsTable 
              title="Add" 
              name="addAPIPersons" 
              control={control} 
              register={register} 
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              rightsConfig={API_RIGHTS}
              headerHeightClass="h-48"
            />
            <RightsTable 
              title="Update" 
              name="updateAPIPersons" 
              control={control} 
              register={register} 
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              rightsConfig={API_RIGHTS}
              headerHeightClass="h-48"
            />
            <RightsTable 
              title="Remove" 
              name="removeAPIPersons" 
              control={control} 
              register={register} 
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              rightsConfig={API_RIGHTS}
              headerHeightClass="h-48"
            />
          </div>
        </form>

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

interface RightsTableProps {
  title: string;
  name: "addLynxPersons" | "updateLynxPersons" | "removeLynxPersons" | "addAPIPersons" | "updateAPIPersons" | "removeAPIPersons";
  control: Control<LynxAPIValues>;
  register: any;
  setValue: UseFormSetValue<LynxAPIValues>;
  getValues: UseFormGetValues<LynxAPIValues>;
  errors: any;
  rightsConfig: { key: string; label: string }[];
  headerHeightClass: string;
}

function RightsTable({ title, name, control, register, setValue, getValues, errors, rightsConfig, headerHeightClass }: RightsTableProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleCheckboxChange = (
    index: number,
    field: string,
    checked: boolean
  ) => {
    const rightsPath = `${name}.${index}.rights`;
    
    if (field === "viewOnly") {
      if (checked) {
        // If View Only is selected, deselect others
        rightsConfig.forEach(right => {
          if (right.key !== "viewOnly") {
            setValue(`${rightsPath}.${right.key}` as any, false);
          }
        });
        setValue(`${rightsPath}.viewOnly` as any, true);
      } else {
        setValue(`${rightsPath}.viewOnly` as any, false);
      }
    } else {
      if (checked) {
        // If any other is selected, deselect View Only
        setValue(`${rightsPath}.viewOnly` as any, false);
        setValue(`${rightsPath}.${field}` as any, true);
      } else {
        setValue(`${rightsPath}.${field}` as any, false);
      }
    }
  };

  const createNewItem = () => {
    const baseItem = {
      id: `${name}-${Date.now()}`,
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
          {title === "Add" && fields.length > 0 && (
            <div className="flex flex-col flex-end gap-3 text-xs text-gray-600">
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append(createNewItem())}
          className="hover:bg-gray-100 p-1"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {fields.length > 0 && (
        <div className="overflow-y-visible">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-semibold text-xs">Name</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">First Name</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">E-Mail Address</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">Phone Number</th>
                {title === "Add" ? (
                  <>
                    {rightsConfig.map((right, index) => (
                      <th key={index} className={`relative ${headerHeightClass} align-bottom pb-2`}>
                        <div className="flex items-end justify-center h-full">
                          <span className="text-xs font-semibold text-gray-700 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                            {right.label}
                          </span>
                        </div>
                      </th>
                    ))}
                  </>
                ) : (
                  <>
                    {rightsConfig.map((_, index) => (
                      <th key={index} className="text-center py-2 px-2 font-semibold text-xs w-16"></th>
                    ))}
                  </>
                )}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <Input
                      {...register(`${name}.${index}.name`)}
                      className="border-gray-300 h-8 text-xs"
                      placeholder="Last Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      {...register(`${name}.${index}.firstname`)}
                      className="border-gray-300 h-8 text-xs"
                      placeholder="First Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="email"
                      {...register(`${name}.${index}.email`)}
                      className="border-gray-300 h-8 text-xs"
                      placeholder="email@example.com"
                    />
                    {errors[name]?.[index]?.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name][index].email.message}
                      </p>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="tel"
                      {...register(`${name}.${index}.phone`)}
                      className="border-gray-300 h-8 text-xs"
                      placeholder="+1234567890"
                    />
                    {errors[name]?.[index]?.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name][index].phone.message}
                      </p>
                    )}
                  </td>
                  {rightsConfig.map((right) => (
                    <td key={right.key} className="py-2 px-2 text-center">
                      <Controller
                        name={`${name}.${index}.rights.${right.key}` as any}
                        control={control}
                        render={({ field }) => (
                          <Checkbox 
                            checked={field.value} 
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
                      onClick={() => remove(index)}
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
