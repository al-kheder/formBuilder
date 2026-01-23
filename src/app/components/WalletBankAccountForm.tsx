import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';

interface PersonRow {
  id: string;
  name: string;
  firstname: string;
  email: string;
  phone: string;
}

interface ValidationErrors {
  [key: string]: {
    email?: string;
    phone?: string;
  };
}

export function WalletBankAccountForm() {
  const [addPersons, setAddPersons] = useState<PersonRow[]>([]);
  const [updatePersons, setUpdatePersons] = useState<PersonRow[]>([]);
  const [removePersons, setRemovePersons] = useState<PersonRow[]>([]);

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone);
  };

  const handlePersonChange = (
    section: 'add' | 'update' | 'remove',
    id: string,
    field: keyof PersonRow,
    value: string
  ) => {
    const setter = section === 'add' ? setAddPersons : section === 'update' ? setUpdatePersons : setRemovePersons;
    
    setter((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, [field]: value } : person
      )
    );

    if (field === 'email' || field === 'phone') {
      setErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined,
        },
      }));
    }
  };

  const handleBlur = (id: string, field: 'email' | 'phone', value: string) => {
    let error = '';
    
    if (field === 'email' && value && !validateEmail(value)) {
      error = 'Invalid email format';
    } else if (field === 'phone' && value && !validatePhone(value)) {
      error = 'Phone number can only contain digits, spaces, +, -, ( )';
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: error,
        },
      }));
    }
  };

  const addPerson = (section: 'add' | 'update' | 'remove') => {
    const setter = section === 'add' ? setAddPersons : section === 'update' ? setUpdatePersons : setRemovePersons;
    const list = section === 'add' ? addPersons : section === 'update' ? updatePersons : removePersons;
    
    const newId = `${section}-${list.length + 1}-${Date.now()}`;
    setter((prev) => [...prev, { id: newId, name: '', firstname: '', email: '', phone: '' }]);
  };

  const removePerson = (section: 'add' | 'update' | 'remove', id: string) => {
    const setter = section === 'add' ? setAddPersons : section === 'update' ? setUpdatePersons : setRemovePersons;
    setter((prev) => prev.filter((person) => person.id !== id));
  };

  const renderSection = (
    title: string,
    section: 'add' | 'update' | 'remove',
    persons: PersonRow[]
  ) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-base font-normal text-gray-900">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addPerson(section)}
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
                <th className="text-left py-2 px-2 font-semibold text-xs">Name</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">First Name</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">E-Mail Address</th>
                <th className="text-left py-2 px-2 font-semibold text-xs">Phone Number</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr key={person.id} className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <Input
                      value={person.name}
                      onChange={(e) =>
                        handlePersonChange(section, person.id, 'name', e.target.value)
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="Last Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={person.firstname}
                      onChange={(e) =>
                        handlePersonChange(section, person.id, 'firstname', e.target.value)
                      }
                      className="border-gray-300 h-8 text-xs"
                      placeholder="First Name"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <div>
                      <Input
                        type="email"
                        value={person.email}
                        onChange={(e) =>
                          handlePersonChange(section, person.id, 'email', e.target.value)
                        }
                        onBlur={(e) => handleBlur(person.id, 'email', e.target.value)}
                        className="border-gray-300 h-8 text-xs"
                        placeholder="email@example.com"
                      />
                      {errors[person.id]?.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[person.id]?.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div>
                      <Input
                        type="tel"
                        value={person.phone}
                        onChange={(e) =>
                          handlePersonChange(section, person.id, 'phone', e.target.value)
                        }
                        onBlur={(e) => handleBlur(person.id, 'phone', e.target.value)}
                        className="border-gray-300 h-8 text-xs"
                        placeholder="+1234567890"
                      />
                      {errors[person.id]?.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[person.id]?.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePerson(section, person.id)}
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
    <div className="w-full max-w-4xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper wallet-bank-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10">
          <img src={logoImage} alt="Crypto Finance" className="h-10" />
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6">
          <h1 className="text-3xl tracking-wider mb-1 text-gray-900" style={{ letterSpacing: '0.15em' }}>
            WALLET & BANK ACCOUNT
          </h1>
          <p className="text-sm text-gray-600">Crypto Finance AG - A Deutsche Börse Group Company</p>
        </div>

        {/* Form Content */}
        <div className="px-8 pt-8 pb-8">
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
          {renderSection('Add', 'add', addPersons)}

          {/* Update Section */}
          {renderSection('Update', 'update', updatePersons)}

          {/* Remove Section */}
          {renderSection('Remove', 'remove', removePersons)}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t">
          <p className="text-xs text-gray-600">
            Crypto Finance AG<br />
            Authorized Persons | 01/10/2025
          </p>
        </div>
      </motion.div>
    </div>
  );
}