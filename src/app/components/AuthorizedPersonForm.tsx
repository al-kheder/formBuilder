import { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Autocomplete } from '@/app/components/ui/autocomplete';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { SignatureCanvas } from '@/app/components/SignatureCanvas';
import { addToAutocompleteHistory, mergeOptionsWithHistory } from '@/data/autocomplete-history';
import { countries, streetNames, getCitiesForCountry, getCountryForCity } from '@/data/locations';
import { usePositions } from '@/hooks/usePositions';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { AuthorizedPersonSchema, type AuthorizedPersonValues } from '@/lib/schemas/AuthorizedPersonSchema';

interface AuthorizedPersonFormProps {
  personNumber?: number;
}

export function AuthorizedPersonForm({ personNumber = 1 }: AuthorizedPersonFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AuthorizedPersonValues>({
    resolver: zodResolver(AuthorizedPersonSchema),
    defaultValues: {
      clientName: '',
      action: '',
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
      signaturePower: '',
      signature: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const watchedCountry = watch('country');
  const watchedCity = watch('city');

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
        setValue('country', countryForCity, { shouldValidate: true });
      }
    }
  }, [watchedCity, setValue]);

  const onSubmit: SubmitHandler<AuthorizedPersonValues> = (data) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-8 pb-8 section-content">
          {/* Client Name Section - Half width */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor={`clientName-${personNumber}`} className="text-sm mb-2 block">
                Client Name:
              </Label>
              <Input
                id={`clientName-${personNumber}`}
                {...register('clientName')}
                className="border-gray-300"
                placeholder="e.g., ABC Corporation AG"
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
              )}
            </div>
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
            <h2 className="text-base font-normal mb-4">
              Person {personNumber}:
            </h2>
            <Controller
              name="action"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-8"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => field.value === 'add' && field.onChange('')}
                  >
                    <RadioGroupItem value="add" id={`add-${personNumber}`} />
                    <Label htmlFor={`add-${personNumber}`} className="cursor-pointer text-base">
                      Add
                    </Label>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => field.value === 'update' && field.onChange('')}
                  >
                    <RadioGroupItem value="update" id={`update-${personNumber}`} />
                    <Label htmlFor={`update-${personNumber}`} className="cursor-pointer text-base">
                      Update
                    </Label>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => field.value === 'remove' && field.onChange('')}
                  >
                    <RadioGroupItem value="remove" id={`remove-${personNumber}`} />
                    <Label htmlFor={`remove-${personNumber}`} className="cursor-pointer text-base">
                      Remove
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Personal Information Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200 form-section">
            <h2 className="text-sm uppercase tracking-wider mb-6" style={{ letterSpacing: '0.1em' }}>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`firstName-${personNumber}`} className="text-sm mb-2 block">
                    First name(s):
                  </Label>
                  <Input
                    id={`firstName-${personNumber}`}
                    {...register('firstName', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/[0-9]/g, '');
                      }
                    })}
                    className="border-gray-300"
                    placeholder="e.g., John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`lastName-${personNumber}`} className="text-sm mb-2 block">
                    Last name(s):
                  </Label>
                  <Input
                    id={`lastName-${personNumber}`}
                    {...register('lastName', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/[0-9]/g, '');
                      }
                    })}
                    className="border-gray-300"
                    placeholder="e.g., Smith"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`dateOfBirth-${personNumber}`} className="text-sm mb-2 block">
                    Date of birth
                  </Label>
                  <Input
                    id={`dateOfBirth-${personNumber}`}
                    type="date"
                    {...register('dateOfBirth')}
                    className="border-gray-300"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`idDocument-${personNumber}`} className="text-sm mb-2 block">
                    ID document number
                  </Label>
                  <Input
                    id={`idDocument-${personNumber}`}
                    {...register('idDocument')}
                    className="border-gray-300"
                    placeholder="e.g., 123456789"
                  />
                  {errors.idDocument && (
                    <p className="text-red-500 text-sm mt-1">{errors.idDocument.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`nationalities-${personNumber}`} className="text-sm mb-2 block">
                    Nationality(-ies)
                  </Label>
                  <Controller
                    name="nationalities"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        id={`nationalities-${personNumber}`}
                        value={field.value}
                        onChange={field.onChange}
                        options={countries}
                        placeholder="Select nationality(ies)..."
                        maxSelections={3}
                      />
                    )}
                  />
                  {errors.nationalities && (
                    <p className="text-red-500 text-sm mt-1">{errors.nationalities.message}</p>
                  )}
                </div>
                <div>
                  {/* Empty column for half-width layout */}
                </div>
              </div>
            </div>
          </div>

          {/* Residence Address Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200 form-section">
            <h2 className="text-sm uppercase tracking-wider mb-6" style={{ letterSpacing: '0.1em' }}>
              Residence Address
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor={`street-${personNumber}`} className="text-sm mb-2 block">
                  Street with street no.
                </Label>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id={`street-${personNumber}`}
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="border-gray-300"
                      options={streetOptions}
                      onValueCommit={(value) => addToAutocompleteHistory('street', value)}
                      placeholder="e.g., Beethovenstrasse 24"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`zipCode-${personNumber}`} className="text-sm mb-2 block">
                    Zip/Postal Code
                  </Label>
                  <Input
                    id={`zipCode-${personNumber}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register('zipCode', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '');
                      }
                    })}
                    className="border-gray-300"
                    placeholder="e.g., 8001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`city-${personNumber}`} className="text-sm mb-2 block">
                    City
                  </Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        id={`city-${personNumber}`}
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="border-gray-300"
                        options={cityOptions}
                        onValueCommit={(value) => addToAutocompleteHistory('city', value)}
                        filterInput={(value) => value.replace(/[0-9]/g, '')}
                        placeholder="e.g., Zurich"
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="text-sm mb-2 block">
                  Country
                </Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id={`country-${personNumber}`}
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="border-gray-300"
                      options={countryOptions}
                      onValueCommit={(value) => addToAutocompleteHistory('country', value)}
                      filterInput={(value) => value.replace(/[0-9]/g, '')}
                      placeholder="e.g., Switzerland"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200 form-section">
            <h2 className="text-sm uppercase tracking-wider mb-6" style={{ letterSpacing: '0.1em' }}>
              Contact
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor={`businessEmail-${personNumber}`} className="text-sm mb-2 block">
                  Business email(s)
                </Label>
                <Input
                  id={`businessEmail-${personNumber}`}
                  type="email"
                  {...register('businessEmail')}
                  className="border-gray-300"
                  placeholder="e.g., john.smith@company.com"
                />
                {errors.businessEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`businessPhone-${personNumber}`} className="text-sm mb-2 block">
                    Business phone number(s)
                  </Label>
                  <Input
                    id={`businessPhone-${personNumber}`}
                    type="tel"
                    {...register('businessPhone')}
                    className="border-gray-300"
                    placeholder="e.g., +41 44 123 4567"
                  />
                  {errors.businessPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessPhone.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`mobilePhone-${personNumber}`} className="text-sm mb-2 block">
                    Mobile phone number
                  </Label>
                  <Input
                    id={`mobilePhone-${personNumber}`}
                    type="tel"
                    {...register('mobilePhone')}
                    className="border-gray-300"
                    placeholder="e.g., +41 79 123 4567"
                  />
                  {errors.mobilePhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobilePhone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor={`position-${personNumber}`} className="text-sm mb-2 block">
                  Function / Position
                </Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id={`position-${personNumber}`}
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="border-gray-300"
                      options={positionOptions}
                      placeholder="Select or type position..."
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8 form-section">
            <h2 className="text-sm uppercase tracking-wider mb-6" style={{ letterSpacing: '0.1em' }}>
              Signature
            </h2>

            <div className="mb-6">
              <Label className="text-sm mb-3 block">Signature power and type</Label>
              <Controller
                name="signaturePower"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex gap-8">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => field.value === 'none' && field.onChange('')}
                      >
                        <RadioGroupItem value="none" id={`sig-none-${personNumber}`} />
                        <Label htmlFor={`sig-none-${personNumber}`} className="cursor-pointer text-base">
                          None
                        </Label>
                      </div>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => field.value === 'sole' && field.onChange('')}
                      >
                        <RadioGroupItem value="sole" id={`sig-sole-${personNumber}`} />
                        <Label htmlFor={`sig-sole-${personNumber}`} className="cursor-pointer text-base">
                          Sole
                        </Label>
                      </div>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => field.value === 'jointly' && field.onChange('')}
                      >
                        <RadioGroupItem value="jointly" id={`sig-jointly-${personNumber}`} />
                        <Label htmlFor={`sig-jointly-${personNumber}`} className="cursor-pointer text-base">
                          Jointly by two
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="mb-6">
              <Label className="text-sm mb-3 block">Signature specimen</Label>
              <Controller
                name="signature"
                control={control}
                render={({ field }) => (
                  <SignatureCanvas
                    onSignatureChange={field.onChange}
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
