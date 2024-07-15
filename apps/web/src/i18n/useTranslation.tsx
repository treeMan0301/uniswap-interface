import i18n, { t } from 'i18next'
import { useTranslation as useTranslationOG } from 'react-i18next'

export function useTranslation() {
  if (process.env.NODE_ENV === 'test') {
    return { i18n, t }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useTranslationOG()
}
