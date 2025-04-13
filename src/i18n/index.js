import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import es from './locales/es.json'
import de from './locales/de.json'
import nl from './locales/nl.json'

const messages = {
  en,
  pt,
  fr,
  it,
  es,
  de,
  nl
}

// Function to get browser language
const getBrowserLocale = () => {
  const navigatorLocale = navigator.languages !== undefined
    ? navigator.languages[0]
    : navigator.language

  if (!navigatorLocale) {
    return 'en'
  }

  // Get the language code (e.g., 'en-US' -> 'en')
  const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0]

  // Check if we have translations for this language
  return Object.keys(messages).includes(trimmedLocale) ? trimmedLocale : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(), // set locale based on browser language
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
})

export default i18n 