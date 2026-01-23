import { AuthorizedPersonForm } from '@/app/components/AuthorizedPersonForm';
import { PersonForm } from '@/app/components/PersonForm';
import { WalletBankAccountForm } from '@/app/components/WalletBankAccountForm';
import { LynxAPIForm } from '@/app/components/LynxAPIForm';
import { ScopeAuthorityForm } from '@/app/components/ScopeAuthorityForm';
import { FormPage } from '@/hooks/useFormPages';

interface FormRendererProps {
  page: FormPage;
  index: number;
}

export function FormRenderer({ page, index }: FormRendererProps) {
  const personNumber = page.label.includes('Person') 
    ? parseInt(page.label.match(/\d+/)?.[0] || '1')
    : undefined;

  switch (page.type) {
    case 'authorized':
      return <AuthorizedPersonForm key={page.id} personNumber={personNumber} />;
    case 'person':
      return <PersonForm key={page.id} personNumber={personNumber} />;
    case 'wallet':
      return <WalletBankAccountForm key={page.id} />;
    case 'lynx':
      return <LynxAPIForm key={page.id} />;
    case 'scope':
      return <ScopeAuthorityForm key={page.id} />;
    default:
      return null;
  }
}
