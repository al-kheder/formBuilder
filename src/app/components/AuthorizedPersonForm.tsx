import { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useForm, useStore } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Label } from '@/app/components/ui/label';
import { SignatureCanvas } from '@/app/components/SignatureCanvas';
import { addToAutocompleteHistory, mergeOptionsWithHistory } from '@/data/autocomplete-history';
import { countries, streetNames, getCitiesForCountry, getCountryForCity } from '@/data/locations';
import { usePositions } from '@/hooks/usePositions';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { AuthorizedPersonSchema, type AuthorizedPersonValues } from '@/lib/schemas/AuthorizedPersonSchema';
import { 
  FormInput, 
  FormAutocomplete, 
  FormMultiSelect, 
  FormRadioGroup, 
  FormSection 
} from '@/app/components/ui/form-fields';

interface AuthorizedPersonFormProps {
  personNumber?: number;
}

export function AuthorizedPersonForm({ personNumber = 1 }: AuthorizedPersonFormProps) {
  const form = useForm<AuthorizedPersonValues>({
    defaultValues: {
      clientName: '',
      action: '' as any,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      idDocument: '',
      nationalities: [],
      street: '',
      zipCode: '',
      city: '',
      country: '',
      businessEmail: '',
      businessPhone: '',
      mobilePhone: '',
      position: '',
      signaturePower: '' as any,
      signature: '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
    },
  });

  const watchedCountry = useStore(form.store, (state) => state.values.country);
  const watchedCity = useStore(form.store, (state) => state.values.city);

  // Merge predefined options with user history
  const streetOptions = useMemo(() => mergeOptionsWithHistory('street', streetNames), []);
  const cityOptions = useMemo(() => {
    const citiesForCountry = getCitiesForCountry(watchedCountry);
    return mergeOptionsWithHistory('city', citiesForCountry);
  }, [watchedCountry]);
  const countryOptions = useMemo(() => mergeOptionsWithHistory('country', countries), []);
  const { allPositions } = usePositions();
  const positionOptions = useMemo(() => allPositions, [allPositions]);

  // Effect to auto-select country when city changes
  useEffect(() => {
    if (watchedCity) {
      const countryForCity = getCountryForCity(watchedCity);
      if (countryForCity) {
        form.setFieldValue('country', countryForCity);
      }
    }
  }, [watchedCity, form]);

  const actionOptions = [
    { value: 'add', label: 'Add', id: `add-${personNumber}` },
    { value: 'update', label: 'Update', id: `update-${personNumber}` },
    { value: 'remove', label: 'Remove', id: `remove-${personNumber}` },
  ];

  const signatureOptions = [
    { value: 'none', label: 'None', id: `sig-none-${personNumber}` },
    { value: 'sole', label: 'Sole', id: `sig-sole-${personNumber}` },
    { value: 'jointly', label: 'Jointly by two', id: `sig-jointly-${personNumber}` },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper authorized-person-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10 logo">
          <img src={logoImage} alt="Crypto Finance" className="h-16" />
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6 form-header">
          <h1 className="text-3xl tracking-wider mb-1 text-gray-900" style={{ letterSpacing: '0.15em' }}>
            AUTHORIZED PERSONS
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
          className="px-8 pt-8 pb-8 section-content"
        >
          {/* Client Name Section - Half width */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <form.Field
              name="clientName"
              validators={{
                onChange: AuthorizedPersonSchema.shape.clientName,
              }}
              children={(field) => (
                <FormInput
                  field={field}
                  label="Client Name:"
                  placeholder="e.g., ABC Corporation AG"
                />
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">
              1. Information & Signature Rights
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The following person is authorized to receive and examine all communications, correspondence and information related to the Client's relationship with Crypto Finance AG. In addition, the person is authorized to subscribe to additional services or to close the account.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">Please note:</span> Without additional authorization, the person is not authorized to view, initiate, approve, or execute any transactions.
            </p>
          </div>

          {/* Action Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200 form-section print-no-break">
            <form.Field
              name="action"
              validators={{
                onChange: AuthorizedPersonSchema.shape.action,
              }}
              children={(field) => (
                <FormRadioGroup
                  field={field}
                  options={actionOptions}
                  label={`Person ${personNumber}:`}
                />
              )}
            />
          </div>

          {/* Personal Information Section */}
          <FormSection title="Personal Information">
            <div className="grid grid-cols-2 gap-6">
              <form.Field
                name="firstName"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.firstName,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="First name(s):"
                    placeholder="e.g., John"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[0-9]/g, '');
                    }}
                  />
                )}
              />
              <form.Field
                name="lastName"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.lastName,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Last name(s):"
                    placeholder="e.g., Smith"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[0-9]/g, '');
                    }}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <form.Field
                name="dateOfBirth"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.dateOfBirth,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Date of birth"
                    type="date"
                  />
                )}
              />
              <form.Field
                name="idDocument"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.idDocument,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="ID document number"
                    placeholder="e.g., 123456789"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <form.Field
                name="nationalities"
        
                children={(field) => (
                  <FormMultiSelect
                    field={field}
                    label="Nationality(-ies)"
                    options={countries}
                    placeholder="Select nationality(ies)..."
                    maxSelections={3}
                  />
                )}
              />
              <div>
                {/* Empty column for half-width layout */}
              </div>
            </div>
          </FormSection>

          {/* Residence Address Section */}
          <FormSection title="Residence Address">
            <form.Field
              name="street"
              validators={{
                onChange: AuthorizedPersonSchema.shape.street,
              }}
              children={(field) => (
                <FormAutocomplete
                  field={field}
                  label="Street with street no."
                  options={streetOptions}
                  onValueCommit={(value) => addToAutocompleteHistory('street', value)}
                  placeholder="e.g., Beethovenstrasse 24"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <form.Field
                name="zipCode"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.zipCode,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Zip/Postal Code"
                    placeholder="e.g., 8001"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                    }}
                  />
                )}
              />
              <form.Field
                name="city"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.city,
                }}
                children={(field) => (
                  <FormAutocomplete
                    field={field}
                    label="City"
                    options={cityOptions}
                    onValueCommit={(value) => addToAutocompleteHistory('city', value)}
                    filterInput={(value) => value.replace(/[0-9]/g, '')}
                    placeholder="e.g., Zurich"
                  />
                )}
              />
            </div>

            <form.Field
              name="country"
              validators={{
                onChange: AuthorizedPersonSchema.shape.country,
              }}
              children={(field) => (
                <FormAutocomplete
                  field={field}
                  label="Country"
                  options={countryOptions}
                  onValueCommit={(value) => addToAutocompleteHistory('country', value)}
                  filterInput={(value) => value.replace(/[0-9]/g, '')}
                  placeholder="e.g., Switzerland"
                />
              )}
            />
          </FormSection>

          {/* Contact Section */}
          <FormSection title="Contact">
            <form.Field
              name="businessEmail"
              validators={{
                onChange: AuthorizedPersonSchema.shape.businessEmail,
              }}
              children={(field) => (
                <FormInput
                  field={field}
                  label="Business email(s)"
                  type="email"
                  placeholder="e.g., john.smith@company.com"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <form.Field
                name="businessPhone"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.businessPhone,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Business phone number(s)"
                    type="tel"
                    placeholder="e.g., +41 44 123 4567"
                  />
                )}
              />
              <form.Field
                name="mobilePhone"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.mobilePhone,
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Mobile phone number"
                    type="tel"
                    placeholder="e.g., +41 79 123 4567"
                  />
                )}
              />
            </div>

            <form.Field
              name="position"
              validators={{
                onChange: AuthorizedPersonSchema.shape.position,
              }}
              children={(field) => (
                <FormAutocomplete
                  field={field}
                  label="Function / Position"
                  options={positionOptions}
                  placeholder="Select or type position..."
                />
              )}
            />
          </FormSection>

          {/* Signature Section */}
          <div className="mb-8 form-section">
            <h2 className="text-sm uppercase tracking-wider mb-6" style={{ letterSpacing: '0.1em' }}>
              Signature
            </h2>

            <div className="mb-6">
              <Label className="text-sm mb-3 block">Signature power and type</Label>
              <form.Field
                name="signaturePower"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.signaturePower,
                }}
                children={(field) => (
                  <FormRadioGroup
                    field={field}
                    options={signatureOptions}
                  />
                )}
              />
            </div>

            <div className="mb-6">
              <Label className="text-sm mb-3 block">Signature specimen</Label>
              <form.Field
                name="signature"
                validators={{
                  onChange: AuthorizedPersonSchema.shape.signature,
                }}
                children={(field) => (
                  <SignatureCanvas
                    onSignatureChange={(val) => field.handleChange(val)}
                  />
                )}
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Please note:</span> Without additional authorization, the person is not authorized to view, initiate, approve or execute any transactions.
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
