import React from 'react'

// Simple i18n client
export const useI18n = () => {
  const [locale, setLocale] = React.useState('en')
  const [translations, setTranslations] = React.useState<Record<string, any>>({})
  
  React.useEffect(() => {
    // Dynamic import to avoid module resolution issues
    const loadTranslations = async () => {
      try {
        const module = await import(`./locales/${locale}`)
        setTranslations(module.default || {})
      } catch (error) {
        console.warn(`Failed to load locale ${locale}, falling back to English`)
        try {
          const module = await import('./locales/en')
          setTranslations(module.default || {})
        } catch (fallbackError) {
          console.error('Failed to load fallback locale:', fallbackError)
          setTranslations({})
        }
      }
    }
    
    loadTranslations()
  }, [locale])
  
  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      // Replace parameters
      if (params) {
        return Object.entries(params).reduce((str, [key, val]) => {
          return str.replace(new RegExp(`{{${key}}}`, 'g'), String(val))
        }, value)
      }
      return value
    }
    
    return key
  }
  
  return { t, locale, setLocale }
}

// Server-side i18n
export const getI18n = async (locale: string) => {
  let translations: Record<string, any> = {}
  
  try {
    const module = await import(`./locales/${locale}`)
    translations = module.default || {}
  } catch (error) {
    console.warn(`Failed to load locale ${locale}, falling back to English`)
    try {
      const module = await import('./locales/en')
      translations = module.default || {}
    } catch (fallbackError) {
      console.error('Failed to load fallback locale:', fallbackError)
      translations = {}
    }
  }
  
  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    if (typeof value === 'string') {
      if (params) {
        return Object.entries(params).reduce((str, [key, val]) => {
          return str.replace(new RegExp(`{{${key}}}`, 'g'), String(val))
        }, value)
      }
      return value
    }
    
    return key
  }
  
  return { t, locale }
}

export const localesList = ['en', 'es', 'it', 'ja', 'zh', 'ko', 'fr', 'de', 'hi', 'pt']
export type Locale = 'en' | 'es' | 'it' | 'ja' | 'zh' | 'ko' | 'fr' | 'de' | 'hi' | 'pt' 