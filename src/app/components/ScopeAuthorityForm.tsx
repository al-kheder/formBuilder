import { motion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/ui/input';
import { SignatureCanvas } from '@/app/components/SignatureCanvas';
import logoImage from '@/assets/4bf4ce36db67390432e530e481235d9d766879e6.png';
import { ScopeAuthoritySchema, type ScopeAuthorityValues } from '@/lib/schemas/ScopeAuthoritySchema';

export function ScopeAuthorityForm() {
  const {
    register,
    control,
    handleSubmit,
  } = useForm<ScopeAuthorityValues>({
    resolver: zodResolver(ScopeAuthoritySchema),
    defaultValues: {
      signature1: { name: '', date: '', place: '', signature: '' },
      signature2: { name: '', date: '', place: '', signature: '' },
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: ScopeAuthorityValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 relative form-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative form-wrapper scope-authority-form"
      >
        {/* Logo in top right */}
        <div className="absolute top-6 right-8 z-10">
          <img src={logoImage} alt="Crypto Finance" className="h-16" />
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6">
          <h1 className="text-3xl tracking-wider mb-1 text-gray-900" style={{ letterSpacing: '0.15em' }}>
            SCOPE OF AUTHORITY
          </h1>
          <p className="text-sm text-gray-600">Crypto Finance AG - A Deutsche Börse Group Company</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-12 pt-10 pb-10">
          {/* Scope of Authority Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4">Scope of Authority</h2>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              The Client hereby authorizes the person(s) above to act on their behalf in all matters specified in relation to dealings with Crypto Finance AG. Any signature, declaration, or action undertaken by the authorized person(s) shall be legally binding upon the Client. The Client confirms the authenticity of the person's signature as provided above.
            </p>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              An individual appointed as authorized person is not permitted to delegate or assign substitute powers of attorney. In cases where the authorized person is a legal entity, the individuals duly authorized by that entity shall be deemed empowered to act within the scope of the authority granted under this Power of Attorney
            </p>
          </div>

          {/* Duration and Revocation Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4">Duration and Revocation</h2>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              This Power of Attorney shall remain in full force and effect until it is revoked in writing by the Client. Such revocation shall become effective only upon receipt of written notice by Crypto Finance AG and after a reasonable period has elapsed to allow for its implementation. Crypto Finance AG shall not be held liable for any loss or damage resulting from actions lawfully undertaken by the authorized person prior to the effective date of revocation.
            </p>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              The Power of Attorney shall not automatically terminate upon the death of the Client, nor upon the Client being declared legally missing, presumed deceased, incapacitated, or bankrupt. In the event of the Client's death, legitimate heirs may revoke the Power of Attorney at any time. Crypto Finance AG reserves the right to suspend execution of instructions issued by the authorized person until written confirmation of authority is received from the Client's heirs
            </p>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              The Client shall remain fully and unconditionally liable for all transactions and obligations executed pursuant to this Power of Attorney
            </p>
          </div>

          {/* Governing Law and Jurisdiction Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              This Power of Attorney shall be governed by and construed exclusively in accordance with the substantive laws of Switzerland, to the exclusion of the principles of conflicts of laws or international treaties.
            </p>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              Any dispute, controversy or claim arising out of or in relation to this Power of Attorney shall be submitted to the exclusive jurisdiction of the courts of Zurich, Switzerland.
            </p>
          </div>

          {/* Data Protection Notice */}
          <div className="mb-8">
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              The Client hereby confirms the above information is accurate and that it has obtained and will maintain the relevant lawful consent from the respective persons to provide their personal data to Crypto Finance AG and to have it processed for the purposes of the Client's relationship with Crypto Finance AG in accordance with the applicable Swiss and European data protection regulations and privacy.
            </p>
            <p className="text-sm text-gray-800 mb-8 leading-relaxed">
              The above information is provided to Crypto Finance AG and processed in accordance with the legal terms and conditions agreed between the Client and Crypto Finance AG.
            </p>
          </div>

          {/* Signature Fields */}
          <div className="space-y-8 mb-12">
            {/* First Signature */}
            <div className="border-t-2 border-gray-800 pt-3">
              {/* Name, Date, Place on same line */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs italic text-gray-600 mb-2 block">
                    Name of Authorized Signatory
                  </label>
                  <Input
                    {...register('signature1.name')}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs italic text-gray-600 mb-2 block">
                    Date
                  </label>
                  <Input
                    type="date"
                    {...register('signature1.date')}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs italic text-gray-600 mb-2 block">
                    Place
                  </label>
                  <Input
                    {...register('signature1.place')}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
              </div>
              {/* Signature on separate line */}
              <div>
                <label className="text-xs italic text-gray-600 mb-2 block">
                  Authorized Signature
                </label>
                <Controller
                  name="signature1.signature"
                  control={control}
                  render={({ field }) => (
                    <SignatureCanvas
                      width={200}
                      height={80}
                      onSignatureChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Second Signature */}
            <div className="border-t-2 border-gray-800 pt-3">
              {/* Name, Date, Place on same line */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs italic text-gray-600 mb-2 block">
                    Name of Authorized Signatory
                  </label>
                  <Input
                    {...register('signature2.name')}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs italic text-gray-600 mb-2 block">
                    Date
                  </label>
                  <Input
                    type="date"
                    {...register('signature2.date')}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs italic text-gray-600 mb-2 block">
                    Place
                  </label>
                  <Input
                    {...register('signature2.place')}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
              </div>
              {/* Signature on separate line */}
              <div>
                <label className="text-xs italic text-gray-600 mb-2 block">
                  Authorized Signature
                </label>
                <Controller
                  name="signature2.signature"
                  control={control}
                  render={({ field }) => (
                    <SignatureCanvas
                      width={200}
                      height={80}
                      onSignatureChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </form>


      </motion.div>
    </div>
  );
}
