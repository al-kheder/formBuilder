import { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Autocomplete } from '@/app/components/ui/autocomplete';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { SignatureCanvas } from '@/app/components/SignatureCanvas';
import { addToAutocompleteHistory, mergeOptionsWithHistory } from '@/data/autocomplete-history';
import { countries, streetNames, getCitiesForCountry, getCountryForCity } from '@/data/locations';
import { getAllPositions } from '@/data/positions';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { PersonSchema, type PersonValues } from '@/lib/schemas/PersonSchema';

interface PersonFormProps {
  personNumber?: number;
}

export function PersonForm({ personNumber = 2 }: PersonFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonValues>({
    resolver: zodResolver(PersonSchema),
    defaultValues: {
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
    mode: 'onBlur',
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
  const positionOptions = useMemo(() => getAllPositions(), []);

  // Effect to auto-select country when city changes
  useEffect(() => {
    if (watchedCity) {
      const countryForCity = getCountryForCity(watchedCity);
      if (countryForCity) {
        setValue('country', countryForCity, { shouldValidate: true });
      }
    }
  }, [watchedCity, setValue]);

  const onSubmit = (data: PersonValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper person-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10">
          <img src={logoImage} alt="Crypto Finance" className="h-10" />
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 pt-24">
          {/* Person Label */}
          <div className="mb-6">
            <h2 className="text-base font-normal">Person {personNumber}:</h2>
          </div>

          {/* Action Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200">
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
                    <RadioGroupItem value="add" id={`add-person${personNumber}`} />
                    <Label htmlFor={`add-person${personNumber}`} className="cursor-pointer text-base">
                      Add
                    </Label>
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => field.value === 'update' && field.onChange('')}
                  >
                    <RadioGroupItem value="update" id={`update-person${personNumber}`} />
                    <Label htmlFor={`update-person${personNumber}`} className="cursor-pointer text-base">
                      Update
                    </Label>
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => field.value === 'remove' && field.onChange('')}
                  >
                    <RadioGroupItem value="remove" id={`remove-person${personNumber}`} />
                    <Label htmlFor={`remove-person${personNumber}`} className="cursor-pointer text-base">
                      Remove
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Personal Information Fields */}
          <div className="space-y-5 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-sm mb-1 block">
                  First name(s):
                </Label>
                <Input
                  id="firstName"
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
                <Label htmlFor="lastName" className="text-sm mb-1 block">
                  Last name(s):
                </Label>
                <Input
                  id="lastName"
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
                <Label htmlFor="dateOfBirth" className="text-sm mb-1 block">
                  Date of birth:
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className="border-gray-300"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="idDocument" className="text-sm mb-1 block">
                  ID document number:
                </Label>
                <Input
                  id="idDocument"
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
                <Label htmlFor="nationalities" className="text-sm mb-1 block">
                  Nationality(-ies):
                </Label>
                <Controller
                  name="nationalities"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      id="nationalities"
                      value={field.value}
                      onChange={field.onChange}
                      options={countryOptions}
                      className="border-gray-300"
                      placeholder="Select or type nationality..."
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

          {/* Residence Address Section */}
          <div className="mb-8">
            <h3 className="text-base font-normal mb-5">Residence address</h3>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="street" className="text-sm mb-1 block">
                  Street with street no.:
                </Label>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="street"
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={streetOptions}
                      className="border-gray-300"
                      onValueCommit={(value) => addToAutocompleteHistory('street', value)}
                      placeholder="e.g., Beethovenstrasse 24"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city" className="text-sm mb-1 block">
                    City:
                  </Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        id="city"
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={cityOptions}
                        className="border-gray-300"
                        onValueCommit={(value) => addToAutocompleteHistory('city', value)}
                        filterInput={(value) => value.replace(/[0-9]/g, '')}
                        placeholder="e.g., Zurich"
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode" className="text-sm mb-1 block">
                    Zip/postal code:
                  </Label>
                  <Input
                    id="zipCode"
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
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="country" className="text-sm mb-1 block">
                    Country:
                  </Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        id="country"
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={countryOptions}
                        className="border-gray-300"
                        onValueCommit={(value) => addToAutocompleteHistory('country', value)}
                        filterInput={(value) => value.replace(/[0-9]/g, '')}
                        placeholder="e.g., Switzerland"
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="businessEmail" className="text-sm mb-1 block">
                    Business email(s):
                  </Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    {...register('businessEmail')}
                    className="border-gray-300"
                    placeholder="e.g., john.smith@company.com"
                  />
                  {errors.businessEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessPhone" className="text-sm mb-1 block">
                    Business phone number(s):
                  </Label>
                  <Input
                    id="businessPhone"
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
                  <Label htmlFor="mobilePhone" className="text-sm mb-1 block">
                    Mobile phone number:
                  </Label>
                  <Input
                    id="mobilePhone"
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
                <Label htmlFor="position" className="text-sm mb-1 block">
                  Function/position:
                </Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="position"
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={positionOptions}
                      className="border-gray-300"
                      onValueCommit={(value) => addToAutocompleteHistory('position', value)}
                      placeholder="Select or type position..."
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <div className="mb-5">
              <Label className="text-sm mb-3 block">Signature power and type:</Label>
              <Controller
                name="signaturePower"
                control={control}
                render={({ field }) => (
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <div className="flex gap-6">
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => field.value === 'none' && field.onChange('')}
                      >
                        <RadioGroupItem value="none" id={`sig-none-p${personNumber}`} />
                        <Label htmlFor={`sig-none-p${personNumber}`} className="cursor-pointer text-sm">
                          None
                        </Label>
                      </div>
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => field.value === 'sole' && field.onChange('')}
                      >
                        <RadioGroupItem value="sole" id={`sig-sole-p${personNumber}`} />
                        <Label htmlFor={`sig-sole-p${personNumber}`} className="cursor-pointer text-sm">
                          Sole
                        </Label>
                      </div>
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => field.value === 'jointly' && field.onChange('')}
                      >
                        <RadioGroupItem value="jointly" id={`sig-jointly-p${personNumber}`} />
                        <Label htmlFor={`sig-jointly-p${personNumber}`} className="cursor-pointer text-sm">
                          Jointly by two
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="mb-8">
              <Label className="text-sm mb-3 block">
                Please provide your signature here as a specimen signature:
              </Label>
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

            <div className="mb-6">
              <p className="text-sm">
                <span className="font-semibold">For any person(s) added or updated with the form above, please also provide a passport copy.</span>
              </p>
            </div>
          </div>
        </form>

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
