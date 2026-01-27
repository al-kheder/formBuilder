import { motion } from 'motion/react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { WalletBankSchema, type WalletBankValues } from '@/lib/schemas/WalletBankSchema';

export function WalletBankAccountForm() {
  const form = useForm<WalletBankValues>({
    defaultValues: {
      addPersons: [],
      updatePersons: [],
      removePersons: [],
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: WalletBankSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper wallet-bank-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10">
          <img src={logoImage} alt="Crypto Finance" className="h-16" />
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6">
          <h1 className="text-3xl tracking-wider mb-1 text-gray-900" style={{ letterSpacing: '0.15em' }}>
            WALLET & BANK ACCOUNT
          </h1>
          <p className="text-sm text-gray-600">Crypto Finance AG - A Deutsche Börse Group Company</p>
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
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              2 Authorized Persons – to communicate wallet and bank account details
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              The person/s named below is/are/were designated by the Client to provide Crypto Finance AG both:
            </p>
            <div className="ml-6 space-y-1 text-sm text-gray-700 mb-6">
              <p>(i) details of FIAT currency accounts from and to which the Client may transfer FIAT, and</p>
              <p>(ii) details of wallets from and to which the Client may transfer crypto assets.</p>
            </div>
          </div>

          {/* Add Section */}
          <form.Field
            name="addPersons"
            mode="array"
            children={(field) => (
              <PersonSection
                title="Add"
                field={field}
                form={form}
              />
            )}
          />

          {/* Update Section */}
          <form.Field
            name="updatePersons"
            mode="array"
            children={(field) => (
              <PersonSection
                title="Update"
                field={field}
                form={form}
              />
            )}
          />

          {/* Remove Section */}
          <form.Field
            name="removePersons"
            mode="array"
            children={(field) => (
              <PersonSection
                title="Remove"
                field={field}
                form={form}
              />
            )}
          />
        </form>
      </motion.div>
    </div>
  );
}

interface PersonSectionProps {
  title: string;
  field: FieldApi<WalletBankValues, any, any, any>;
  form: any;
}

function PersonSection({ title, field, form }: PersonSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-base font-normal text-gray-900">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => field.pushValue({ id: `${field.name}-${Date.now()}`, name: '', firstname: '', email: '', phone: '' })}
          className="hover:bg-gray-100 p-1"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {field.state.value.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-semibold text-xs">Name</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">First Name</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">E-Mail Address</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">Phone Number</th>
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
