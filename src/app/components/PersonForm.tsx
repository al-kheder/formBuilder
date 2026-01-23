import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Autocomplete } from '@/app/components/ui/autocomplete';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { SignatureCanvas } from '@/app/components/SignatureCanvas';
import { addToAutocompleteHistory, mergeOptionsWithHistory } from '@/data/autocomplete-history';
import { countries, streetNames, getCitiesForCountry, getCountryForCity } from '@/data/locations';
import { getAllPositions } from '@/data/positions';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';

interface PersonFormProps {
  personNumber?: number;
}

export function PersonForm({ personNumber = 2 }: PersonFormProps) {
  const [formData, setFormData] = useState({
    action: '', // Changed from object to string ('add', 'update', 'remove', or '')
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    idDocument: '',
    nationalities: [] as string[], // Changed to array for multiple selections
    street: '',
    city: '',
    zipCode: '',
    country: '',
    businessEmail: '',
    businessPhone: '',
    mobilePhone: '',
    position: '',
    signaturePower: '', // Changed to single string value: 'none', 'sole', or 'jointly'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Merge predefined options with user history
  const streetOptions = useMemo(() => mergeOptionsWithHistory('street', streetNames), []);
  const cityOptions = useMemo(() => {
    const citiesForCountry = getCitiesForCountry(formData.country);
    return mergeOptionsWithHistory('city', citiesForCountry);
  }, [formData.country]);
  const countryOptions = useMemo(() => mergeOptionsWithHistory('country', countries), []);
  const positionOptions = useMemo(() => getAllPositions(), []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phone.length === 0 || phoneRegex.test(phone);
  };

  const validateNumeric = (value: string): boolean => {
    return /^\d+$/.test(value);
  };

  const validateField = (field: string, value: any) => {
    let error = '';

    switch (field) {
      case 'firstName':
        if (!value || !value.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!value || !value.trim()) error = 'Last name is required';
        break;
      case 'businessEmail':
        if (value && !validateEmail(value)) error = 'Invalid email format';
        break;
      case 'businessPhone':
      case 'mobilePhone':
        if (value && !validatePhone(value)) error = 'Phone number can only contain digits, spaces, +, -, ( )';
        break;
      case 'zipCode':
        if (value && !validateNumeric(value)) error = 'Zip code must contain only numbers';
        break;
      case 'idDocument':
        if (value && !validateNumeric(value)) error = 'ID document number must contain only numbers';
        break;
      case 'dateOfBirth':
        if (!value) error = 'Date of birth is required';
        break;
      case 'nationalities':
        if (!Array.isArray(value) || value.length === 0) error = 'At least one nationality is required';
        if (Array.isArray(value) && value.length > 3) error = 'Maximum of 3 nationalities allowed';
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    validateField(field, value);
  };

  const handleActionChange = (action: 'add' | 'update' | 'remove') => {
    setFormData((prev) => ({
      ...prev,
      action: action, // Set the action directly
    }));
  };

  const handleSignatureChange = (type: 'none' | 'sole' | 'jointly') => {
    setFormData((prev) => ({
      ...prev,
      signaturePower: type,
    }));
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    if (field === 'nationalities') {
      // Handle nationality array updates
      setFormData((prev) => ({
        ...prev,
        nationalities: value as string[],
      }));
      // Validate nationalities
      setTouched((prev) => ({ ...prev, nationalities: true }));
      validateField('nationalities', value);
    } else if (field === 'country') {
      // When country changes, keep the city value even if it's not in the filtered list
      // This allows users to enter custom cities
      setFormData((prev) => ({
        ...prev,
        country: value as string,
      }));
    } else if (field === 'city') {
      // When city changes, auto-select the corresponding country if city is in the list
      const countryForCity = getCountryForCity(value as string);
      if (countryForCity) {
        // City is in the predefined list, auto-set country
        setFormData((prev) => ({
          ...prev,
          city: value as string,
          country: countryForCity,
        }));
      } else {
        // City is custom (not in list), just update the city
        setFormData((prev) => ({
          ...prev,
          city: value as string,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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
        <div className="px-8 py-8 pt-24">
          {/* Person Label */}
          <div className="mb-6">
            <h2 className="text-base font-normal">Person {personNumber}:</h2>
          </div>

          {/* Action Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200">
            <RadioGroup value={formData.action} onValueChange={handleActionChange} className="flex gap-8">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => formData.action === 'add' && handleActionChange('')}
              >
                <RadioGroupItem value="add" id="add-person2" />
                <Label htmlFor="add-person2" className="cursor-pointer text-base">
                  Add
                </Label>
              </div>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => formData.action === 'update' && handleActionChange('')}
              >
                <RadioGroupItem value="update" id="update-person2" />
                <Label htmlFor="update-person2" className="cursor-pointer text-base">
                  Update
                </Label>
              </div>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => formData.action === 'remove' && handleActionChange('')}
              >
                <RadioGroupItem value="remove" id="remove-person2" />
                <Label htmlFor="remove-person2" className="cursor-pointer text-base">
                  Remove
                </Label>
              </div>
            </RadioGroup>
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
                  value={formData.firstName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[0-9]/g, '');
                    handleInputChange('firstName', value);
                  }}
                  onBlur={() => handleBlur('firstName')}
                  className="border-gray-300"
                  placeholder="e.g., John"
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm mb-1 block">
                  Last name(s):
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[0-9]/g, '');
                    handleInputChange('lastName', value);
                  }}
                  onBlur={() => handleBlur('lastName')}
                  className="border-gray-300"
                  placeholder="e.g., Smith"
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
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
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  onBlur={() => handleBlur('dateOfBirth')}
                  className="border-gray-300"
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
              <div>
                <Label htmlFor="idDocument" className="text-sm mb-1 block">
                  ID document number:
                </Label>
                <Input
                  id="idDocument"
                  value={formData.idDocument}
                  onChange={(e) => handleInputChange('idDocument', e.target.value)}
                  onBlur={() => handleBlur('idDocument')}
                  className="border-gray-300"
                  placeholder="e.g., 123456789"
                />
                {touched.idDocument && errors.idDocument && (
                  <p className="text-red-500 text-sm mt-1">{errors.idDocument}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nationalities" className="text-sm mb-1 block">
                  Nationality(-ies):
                </Label>
                <MultiSelect
                  id="nationalities"
                  value={formData.nationalities}
                  onChange={(value) => handleInputChange('nationalities', value)}
                  options={countryOptions}
                  className="border-gray-300"
                  placeholder="Select or type nationality..."
                  maxSelections={3}
                />
                {touched.nationalities && errors.nationalities && (
                  <p className="text-red-500 text-sm mt-1">{errors.nationalities}</p>
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
                <Autocomplete
                  id="street"
                  value={formData.street}
                  onChange={(value) => handleInputChange('street', value)}
                  options={streetOptions}
                  className="border-gray-300"
                  onValueCommit={(value) => addToAutocompleteHistory('street', value)}
                  placeholder="e.g., Beethovenstrasse 24"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city" className="text-sm mb-1 block">
                    City:
                  </Label>
                  <Autocomplete
                    id="city"
                    value={formData.city}
                    onChange={(value) => handleInputChange('city', value)}
                    options={cityOptions}
                    className="border-gray-300"
                    onValueCommit={(value) => addToAutocompleteHistory('city', value)}
                    filterInput={(value) => value.replace(/[0-9]/g, '')}
                    placeholder="e.g., Zurich"
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
                    value={formData.zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('zipCode', value);
                    }}
                    onBlur={() => handleBlur('zipCode')}
                    className="border-gray-300"
                    placeholder="e.g., 8001"
                  />
                  {touched.zipCode && errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="country" className="text-sm mb-1 block">
                    Country:
                  </Label>
                  <Autocomplete
                    id="country"
                    value={formData.country}
                    onChange={(value) => handleInputChange('country', value)}
                    options={countryOptions}
                    className="border-gray-300"
                    onValueCommit={(value) => addToAutocompleteHistory('country', value)}
                    filterInput={(value) => value.replace(/[0-9]/g, '')}
                    placeholder="e.g., Switzerland"
                  />
                </div>
                <div>
                  <Label htmlFor="businessEmail" className="text-sm mb-1 block">
                    Business email(s):
                  </Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                    className="border-gray-300"
                    onBlur={() => handleBlur('businessEmail')}
                    placeholder="e.g., john.smith@company.com"
                  />
                  {touched.businessEmail && errors.businessEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>
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
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                    className="border-gray-300"
                    onBlur={() => handleBlur('businessPhone')}
                    placeholder="e.g., +41 44 123 4567"
                  />
                  {touched.businessPhone && errors.businessPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="mobilePhone" className="text-sm mb-1 block">
                    Mobile phone number:
                  </Label>
                  <Input
                    id="mobilePhone"
                    type="tel"
                    value={formData.mobilePhone}
                    onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                    className="border-gray-300"
                    onBlur={() => handleBlur('mobilePhone')}
                    placeholder="e.g., +41 79 123 4567"
                  />
                  {touched.mobilePhone && errors.mobilePhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobilePhone}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="position" className="text-sm mb-1 block">
                  Function/position:
                </Label>
                <Autocomplete
                  id="position"
                  value={formData.position}
                  onChange={(value) => handleInputChange('position', value)}
                  options={positionOptions}
                  className="border-gray-300"
                  onValueCommit={(value) => addToAutocompleteHistory('position', value)}
                  placeholder="Select or type position..."
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <div className="mb-5">
              <Label className="text-sm mb-3 block">Signature power and type:</Label>
              <RadioGroup value={formData.signaturePower} onValueChange={(value) => handleSignatureChange(value as 'none' | 'sole' | 'jointly')}>
                <div className="flex gap-6">
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => formData.signaturePower === 'none' && handleSignatureChange('')}
                  >
                    <RadioGroupItem value="none" id="sig-none-p2" />
                    <Label htmlFor="sig-none-p2" className="cursor-pointer text-sm">
                      None
                    </Label>
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => formData.signaturePower === 'sole' && handleSignatureChange('')}
                  >
                    <RadioGroupItem value="sole" id="sig-sole-p2" />
                    <Label htmlFor="sig-sole-p2" className="cursor-pointer text-sm">
                      Sole
                    </Label>
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => formData.signaturePower === 'jointly' && handleSignatureChange('')}
                  >
                    <RadioGroupItem value="jointly" id="sig-jointly-p2" />
                    <Label htmlFor="sig-jointly-p2" className="cursor-pointer text-sm">
                      Jointly by two
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="mb-8">
              <Label className="text-sm mb-3 block">
                Please provide your signature here as a specimen signature:
              </Label>
              <SignatureCanvas />
            </div>

            <div className="mb-6">
              <p className="text-sm">
                <span className="font-semibold">For any person(s) added or updated with the form above, please also provide a passport copy.</span>
              </p>
            </div>
          </div>
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