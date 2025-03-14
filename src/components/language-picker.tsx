import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  pt: 'Português',
};

type LanguagePickerProps = {
  className?: string;
};

/**
 * @name LanguagePicker
 *
 * @description
 * This component allows the user to change the application language.
 */
export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  className,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const supportedLanguages = i18n.options.supportedLngs || ['en'];
  const onlySupportedLanguages = supportedLanguages.filter(
    (lang) => LANGUAGE_LABELS[lang]
  );

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Set the document language attribute when the language changes
  useEffect(() => {
    i18n.on('languageChanged', (lang) => {
      document.documentElement.lang = lang;
    });
  }, [currentLanguage, i18n]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className={cn('', className)}>
          <span className='text-sm font-light'>
            {LANGUAGE_LABELS[currentLanguage]}
          </span>
          <ChevronDown
            className='-me-1 ms-2 opacity-60'
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={currentLanguage}
          onValueChange={handleLanguageChange}
        >
          {onlySupportedLanguages.map((lang) => (
            <DropdownMenuRadioItem key={lang} value={lang}>
              {LANGUAGE_LABELS[lang]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
