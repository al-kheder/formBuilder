import { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useForm, useStore } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Label } from '@/app/components/ui/label';
import { SignatureCanvas } from '@/app/components/SignatureCanvas';
import { addToAutocompleteHistory, mergeOptionsWithHistory } from '@/data/autocomplete-history';
import { countries, streetNames, getCitiesForCountry, getCountryForCity } from '@/data/locations';
import { getAllPositions } from '@/data/positions';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { PersonSchema, type PersonValues } from '@/lib/schemas/PersonSchema';
import { 
  FormInput, 
  FormAutocomplete, 
  FormMultiSelect, 
  FormRadioGroup 
} from '@/app/components/ui/form-fields';

interface PersonFormProps {
  personNumber?: number;
}

export function PersonForm({ personNumber = 2 }: PersonFormProps) {
  const form = useForm<PersonValues>({
    defaultValues: {
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
    validators: {
      onChange: PersonSchema,
    },
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
  const positionOptions = useMemo(() => getAllPositions(), []);

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
    { value: 'add', label: 'Add', id: `add-person${personNumber}` },
    { value: 'update', label: 'Update', id: `update-person${personNumber}` },
    { value: 'remove', label: 'Remove', id: `remove-person${personNumber}` },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper person-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10">
          <img src={logoImage} alt="Crypto Finance" className="h-16" />
        </div>

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="px-8 py-8 pt-24"
        >
          {/* Person Label */}
          <div className="mb-6">
            <h2 className="text-base font-normal">Person {personNumber}:</h2>
          </div>

          {/* Action Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200">
            <form.Field
              name="action"
              children={(field) => (
                <FormRadioGroup
                  field={field}
                  options={actionOptions}
                />
              )}
            />
          </div>

          {/* Personal Information Fields */}
          <div className="space-y-5 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <form.Field
                name="firstName"
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
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Date of birth:"
                    type="date"
                  />
                )}
              />
              <form.Field
                name="idDocument"
                children={(field) => (
                  <FormInput
                    field={field}
                    label="ID document number:"
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
                    label="Nationality(-ies):"
                    options={countryOptions}
                    placeholder="Select or type nationality..."
                    maxSelections={3}
                  />
                )}
              />
              <div>
                {/* Empty column for half-width layout */}
              </div>
            </div>
          </div>

          {/* Residence Address Section */}
          <div className="mb-8">
            <h3 className="text-base font-normal mb-5">Residence address</h3>

            <div className="space-y-5">
              <form.Field
                name="street"
                children={(field) => (
                  <FormAutocomplete
                    field={field}
                    label="Street with street no.:"
                    options={streetOptions}
                    onValueCommit={(value) => addToAutocompleteHistory('street', value)}
                    placeholder="e.g., Beethovenstrasse 24"
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <form.Field
                  name="city"
                  children={(field) => (
                    <FormAutocomplete
                      field={field}
                      label="City:"
                      options={cityOptions}
                      onValueCommit={(value) => addToAutocompleteHistory('city', value)}
                      filterInput={(value) => value.replace(/[0-9]/g, '')}
                      placeholder="e.g., Zurich"
                    />
                  )}
                />
                <form.Field
                  name="zipCode"
                  children={(field) => (
                    <FormInput
                      field={field}
                      label="Zip/postal code:"
                      placeholder="e.g., 8001"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '');
                      }}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <form.Field
                  name="country"
                  children={(field) => (
                    <FormAutocomplete
                      field={field}
                      label="Country:"
                      options={countryOptions}
                      onValueCommit={(value) => addToAutocompleteHistory('country', value)}
                      filterInput={(value) => value.replace(/[0-9]/g, '')}
                      placeholder="e.g., Switzerland"
                    />
                  )}
                />
                <form.Field
                  name="businessEmail"
                  children={(field) => (
                    <FormInput
                      field={field}
                      label="Business email(s):"
                      type="email"
                      placeholder="e.g., john.smith@company.com"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <form.Field
                  name="businessPhone"
                  children={(field) => (
                    <FormInput
                      field={field}
                      label="Business phone number(s):"
                      type="tel"
                      placeholder="e.g., +41 44 123 4567"
                    />
                  )}
                />
                <form.Field
                  name="mobilePhone"
                  children={(field) => (
                    <FormInput
                      field={field}
                      label="Mobile phone number:"
                      type="tel"
                      placeholder="e.g., +41 79 123 4567"
                    />
                  )}
                />
              </div>

              <form.Field
                name="position"
                children={(field) => (
                  <FormAutocomplete
                    field={field}
                    label="Function/position:"
                    options={positionOptions}
                    onValueCommit={(value) => addToAutocompleteHistory('position', value)}
                    placeholder="Select or type position..."
                  />
                )}
              />
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <div className="mb-5">
              <Label className="text-sm mb-3 block">Signature power and type:</Label>
              <form.Field
                name="signaturePower"
                children={(field) => (
                  <FormRadioGroup
                    field={field}
                    options={[
                      { value: 'none', label: 'None', id: `sig-none-p${personNumber}` },
                      { value: 'sole', label: 'Sole', id: `sig-sole-p${personNumber}` },
                      { value: 'jointly', label: 'Jointly by two', id: `sig-jointly-p${personNumber}` },
                    ]}
                  />
                )}
              />
            </div>

            <div className="mb-8">
              <Label className="text-sm mb-3 block">
                Please provide your signature here as a specimen signature:
              </Label>
              <form.Field
                name="signature"
                children={(field) => (
                  <SignatureCanvas
                    onSignatureChange={(val) => field.handleChange(val)}
                  />
                )}
              />
            </div>

            <div className="mb-6">
              <p className="text-sm">
                <span className="font-semibold">For any person(s) added or updated with the form above, please also provide a passport copy.</span>
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
