import { motion } from 'motion/react';
import { useForm, useFieldArray, Control, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { WalletBankSchema, type WalletBankValues } from '@/lib/schemas/WalletBankSchema';

export function WalletBankAccountForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WalletBankValues>({
    resolver: zodResolver(WalletBankSchema),
    defaultValues: {
      addPersons: [],
      updatePersons: [],
      removePersons: [],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit: SubmitHandler<WalletBankValues> = (data) => {
    console.log('Form submitted:', data);
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-8 pb-8">
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
          <PersonSection
            title="Add"
            name="addPersons"
            control={control}
            register={register}
            errors={errors}
          />

          {/* Update Section */}
          <PersonSection
            title="Update"
            name="updatePersons"
            control={control}
            register={register}
            errors={errors}
          />

          {/* Remove Section */}
          <PersonSection
            title="Remove"
            name="removePersons"
            control={control}
            register={register}
            errors={errors}
          />
        </form>


      </motion.div>
    </div>
  );
}

interface PersonSectionProps {
  title: string;
  name: 'addPersons' | 'updatePersons' | 'removePersons';
  control: Control<WalletBankValues>;
  register: any;
  errors: any;
}

function PersonSection({ title, name, control, register, errors }: PersonSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-base font-normal text-gray-900">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ id: `${name}-${Date.now()}`, name: '', firstname: '', email: '', phone: '' })}
          className="hover:bg-gray-100 p-1"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {fields.length > 0 && (
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
                    <div>
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
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div>
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
                    </div>
                  </td>
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
