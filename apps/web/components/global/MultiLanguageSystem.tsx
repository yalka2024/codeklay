// Multi-Language & Localization System for CodePal
// Features: Internationalization (i18n), RTL support, cultural adaptation, regional customization

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  region: string;
  flag: string;
  isActive: boolean;
  translationProgress: number;
  lastUpdated: string;
}

interface RegionalSettings {
  country: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  measurementSystem: 'metric' | 'imperial';
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  holidays: string[];
  compliance: string[];
}

interface LocalizedContent {
  id: string;
  type: 'ui' | 'documentation' | 'help' | 'error' | 'notification';
  key: string;
  translations: Record<string, string>;
  context?: string;
  lastUpdated: string;
  isApproved: boolean;
}

interface CulturalAdaptation {
  id: string;
  region: string;
  category: 'ui_patterns' | 'color_schemes' | 'typography' | 'icons' | 'workflows';
  settings: Record<string, any>;
  description: string;
  isActive: boolean;
}

interface TranslationProject {
  id: string;
  name: string;
  language: string;
  status: 'draft' | 'in_progress' | 'review' | 'approved' | 'published';
  progress: {
    total: number;
    translated: number;
    reviewed: number;
    approved: number;
  };
  contributors: string[];
  deadline: string;
  createdAt: string;
  lastUpdated: string;
}

export default function MultiLanguageSystem() {
  const { user } = useAuthContext();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [regionalSettings, setRegionalSettings] = useState<RegionalSettings[]>([]);
  const [localizedContent, setLocalizedContent] = useState<LocalizedContent[]>([]);
  const [culturalAdaptations, setCulturalAdaptations] = useState<CulturalAdaptation[]>([]);
  const [translationProjects, setTranslationProjects] = useState<TranslationProject[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'regions' | 'content' | 'cultural' | 'translations'>('overview');

  // Load multi-language data
  const loadMultiLanguageData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockLanguages: Language[] = [
        {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          direction: 'ltr',
          region: 'US',
          flag: '🇺🇸',
          isActive: true,
          translationProgress: 100,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          direction: 'ltr',
          region: 'ES',
          flag: '🇪🇸',
          isActive: true,
          translationProgress: 85,
          lastUpdated: '2024-01-14T15:45:00Z'
        },
        {
          code: 'fr',
          name: 'French',
          nativeName: 'Français',
          direction: 'ltr',
          region: 'FR',
          flag: '🇫🇷',
          isActive: true,
          translationProgress: 78,
          lastUpdated: '2024-01-13T12:20:00Z'
        },
        {
          code: 'de',
          name: 'German',
          nativeName: 'Deutsch',
          direction: 'ltr',
          region: 'DE',
          flag: '🇩🇪',
          isActive: true,
          translationProgress: 72,
          lastUpdated: '2024-01-12T09:15:00Z'
        },
        {
          code: 'zh',
          name: 'Chinese (Simplified)',
          nativeName: '中文 (简体)',
          direction: 'ltr',
          region: 'CN',
          flag: '🇨🇳',
          isActive: true,
          translationProgress: 65,
          lastUpdated: '2024-01-11T14:30:00Z'
        },
        {
          code: 'ja',
          name: 'Japanese',
          nativeName: '日本語',
          direction: 'ltr',
          region: 'JP',
          flag: '🇯🇵',
          isActive: true,
          translationProgress: 58,
          lastUpdated: '2024-01-10T11:45:00Z'
        },
        {
          code: 'ko',
          name: 'Korean',
          nativeName: '한국어',
          direction: 'ltr',
          region: 'KR',
          flag: '🇰🇷',
          isActive: true,
          translationProgress: 45,
          lastUpdated: '2024-01-09T16:20:00Z'
        },
        {
          code: 'pt',
          name: 'Portuguese',
          nativeName: 'Português',
          direction: 'ltr',
          region: 'BR',
          flag: '🇧🇷',
          isActive: true,
          translationProgress: 52,
          lastUpdated: '2024-01-08T13:10:00Z'
        },
        {
          code: 'ru',
          name: 'Russian',
          nativeName: 'Русский',
          direction: 'ltr',
          region: 'RU',
          flag: '🇷🇺',
          isActive: true,
          translationProgress: 38,
          lastUpdated: '2024-01-07T10:25:00Z'
        },
        {
          code: 'ar',
          name: 'Arabic',
          nativeName: 'العربية',
          direction: 'rtl',
          region: 'SA',
          flag: '🇸🇦',
          isActive: true,
          translationProgress: 25,
          lastUpdated: '2024-01-06T08:40:00Z'
        }
      ];

      const mockRegionalSettings: RegionalSettings[] = [
        {
          country: 'United States',
          currency: 'USD',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          numberFormat: '1,234.56',
          measurementSystem: 'imperial',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:00', end: '17:00' },
          holidays: ['2024-01-01', '2024-07-04', '2024-12-25'],
          compliance: ['CCPA', 'SOX', 'HIPAA']
        },
        {
          country: 'European Union',
          currency: 'EUR',
          timezone: 'Europe/Brussels',
          dateFormat: 'DD/MM/YYYY',
          numberFormat: '1.234,56',
          measurementSystem: 'metric',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '08:00', end: '18:00' },
          holidays: ['2024-01-01', '2024-05-01', '2024-12-25'],
          compliance: ['GDPR', 'ISO 27001', 'SOC 2']
        },
        {
          country: 'Japan',
          currency: 'JPY',
          timezone: 'Asia/Tokyo',
          dateFormat: 'YYYY/MM/DD',
          numberFormat: '1,234',
          measurementSystem: 'metric',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:00', end: '18:00' },
          holidays: ['2024-01-01', '2024-05-05', '2024-12-23'],
          compliance: ['PIPA', 'ISO 27001']
        }
      ];

      const mockLocalizedContent: LocalizedContent[] = [
        {
          id: '1',
          type: 'ui',
          key: 'dashboard.welcome',
          translations: {
            en: 'Welcome to CodePal',
            es: 'Bienvenido a CodePal',
            fr: 'Bienvenue sur CodePal',
            de: 'Willkommen bei CodePal',
            zh: '欢迎使用 CodePal',
            ja: 'CodePal へようこそ',
            ko: 'CodePal에 오신 것을 환영합니다',
            pt: 'Bem-vindo ao CodePal',
            ru: 'Добро пожаловать в CodePal',
            ar: 'مرحباً بك في CodePal'
          },
          context: 'Main dashboard welcome message',
          lastUpdated: '2024-01-15T10:30:00Z',
          isApproved: true
        },
        {
          id: '2',
          type: 'documentation',
          key: 'docs.getting_started.title',
          translations: {
            en: 'Getting Started',
            es: 'Comenzando',
            fr: 'Commencer',
            de: 'Erste Schritte',
            zh: '开始使用',
            ja: 'はじめに',
            ko: '시작하기',
            pt: 'Começando',
            ru: 'Начало работы',
            ar: 'البدء'
          },
          context: 'Documentation section title',
          lastUpdated: '2024-01-14T15:45:00Z',
          isApproved: true
        }
      ];

      const mockCulturalAdaptations: CulturalAdaptation[] = [
        {
          id: '1',
          region: 'Japan',
          category: 'ui_patterns',
          settings: {
            navigationStyle: 'vertical',
            colorScheme: 'minimal',
            typography: 'sans-serif',
            spacing: 'compact',
            iconStyle: 'outlined'
          },
          description: 'Japanese UI patterns emphasizing minimalism and efficiency',
          isActive: true
        },
        {
          id: '2',
          region: 'Middle East',
          category: 'color_schemes',
          settings: {
            primaryColor: '#006C51',
            secondaryColor: '#8B4513',
            backgroundColor: '#F5F5DC',
            textColor: '#2F2F2F',
            accentColor: '#DAA520'
          },
          description: 'Middle Eastern color scheme with cultural significance',
          isActive: true
        }
      ];

      const mockTranslationProjects: TranslationProject[] = [
        {
          id: '1',
          name: 'CodePal UI Translation - Spanish',
          language: 'es',
          status: 'in_progress',
          progress: {
            total: 1250,
            translated: 1062,
            reviewed: 850,
            approved: 750
          },
          contributors: ['Ana García', 'Carlos López', 'María Rodríguez'],
          deadline: '2024-02-15T00:00:00Z',
          createdAt: '2024-01-01T09:00:00Z',
          lastUpdated: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          name: 'Documentation Translation - French',
          language: 'fr',
          status: 'review',
          progress: {
            total: 800,
            translated: 624,
            reviewed: 500,
            approved: 400
          },
          contributors: ['Pierre Dubois', 'Marie Laurent'],
          deadline: '2024-02-28T00:00:00Z',
          createdAt: '2024-01-05T10:00:00Z',
          lastUpdated: '2024-01-14T16:45:00Z'
        }
      ];

      setLanguages(mockLanguages);
      setRegionalSettings(mockRegionalSettings);
      setLocalizedContent(mockLocalizedContent);
      setCulturalAdaptations(mockCulturalAdaptations);
      setTranslationProjects(mockTranslationProjects);
    } catch (error) {
      console.error('Error loading multi-language data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle language activation
  const toggleLanguage = async (languageCode: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLanguages(prev => prev.map(lang => 
        lang.code === languageCode 
          ? { ...lang, isActive: !lang.isActive }
          : lang
      ));
    } catch (error) {
      console.error('Error toggling language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new translation project
  const createTranslationProject = async (name: string, language: string) => {
    try {
      const newProject: TranslationProject = {
        id: `project-${Date.now()}`,
        name,
        language,
        status: 'draft',
        progress: {
          total: 0,
          translated: 0,
          reviewed: 0,
          approved: 0
        },
        contributors: [],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      setTranslationProjects(prev => [newProject, ...prev]);
    } catch (error) {
      console.error('Error creating translation project:', error);
    }
  };

  // Update localized content
  const updateLocalizedContent = async (contentId: string, language: string, translation: string) => {
    try {
      setLocalizedContent(prev => prev.map(content => 
        content.id === contentId 
          ? {
              ...content,
              translations: {
                ...content.translations,
                [language]: translation
              },
              lastUpdated: new Date().toISOString()
            }
          : content
      ));
    } catch (error) {
      console.error('Error updating localized content:', error);
    }
  };

  useEffect(() => {
    loadMultiLanguageData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Languages</h3>
          <p className="text-2xl font-bold text-blue-600">{languages.filter(l => l.isActive).length}</p>
          <p className="text-xs text-gray-400">Supported languages</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Translation Progress</h3>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(languages.reduce((acc, lang) => acc + lang.translationProgress, 0) / languages.length)}%
          </p>
          <p className="text-xs text-gray-400">Translation completion</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Regional Settings</h3>
          <p className="text-2xl font-bold text-purple-600">{regionalSettings.length}</p>
          <p className="text-xs text-gray-400">Configured regions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
          <p className="text-2xl font-bold text-orange-600">{translationProjects.filter(p => p.status === 'in_progress').length}</p>
          <p className="text-xs text-gray-400">Translation projects</p>
        </div>
      </div>

      {/* Language Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Language Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {languages.slice(0, 10).map(language => (
              <div key={language.code} className="text-center">
                <div className="text-2xl mb-2">{language.flag}</div>
                <h4 className="font-medium text-gray-900 text-sm">{language.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{language.nativeName}</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${language.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-xs text-gray-500">{language.translationProgress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Translation Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Translation Projects</h3>
        </div>
        <div className="p-6">
          {translationProjects.slice(0, 3).map(project => (
            <div key={project.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-500">
                  {project.progress.translated}/{project.progress.total} translated
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'review' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Language Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Language
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {languages.map(language => (
          <div key={language.code} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{language.flag}</span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{language.name}</h3>
                  <p className="text-sm text-gray-500">{language.nativeName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  language.direction === 'rtl' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {language.direction.toUpperCase()}
                </span>
                <button
                  onClick={() => toggleLanguage(language.code)}
                  disabled={isLoading}
                  className={`px-3 py-1 text-sm rounded ${
                    language.isActive 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  } disabled:opacity-50`}
                >
                  {language.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Translation Progress</span>
                <span className="text-sm font-medium text-gray-900">{language.translationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${language.translationProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Region</p>
                <p className="font-medium text-gray-900">{language.region}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(language.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Manage Translations
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegions = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Regional Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regionalSettings.map(region => (
          <div key={region.country} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{region.country}</h3>
              <p className="text-sm text-gray-500">Regional configuration</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="font-medium text-gray-900">{region.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timezone</p>
                <p className="font-medium text-gray-900">{region.timezone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Format</p>
                <p className="font-medium text-gray-900">{region.dateFormat}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number Format</p>
                <p className="font-medium text-gray-900">{region.numberFormat}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Working Hours</p>
              <p className="text-sm text-gray-600">
                {region.workingDays.join(', ')} • {region.workingHours.start} - {region.workingHours.end}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Compliance</p>
              <div className="flex flex-wrap gap-1">
                {region.compliance.map(comp => (
                  <span key={comp} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Settings
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Localized Content</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Content
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {localizedContent.map(content => (
            <div key={content.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{content.key}</h3>
                  <p className="text-sm text-gray-500">{content.type} • {content.context}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  content.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {content.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(content.translations).slice(0, 6).map(([lang, translation]) => (
                  <div key={lang} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">{lang.toUpperCase()}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{translation}</p>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Last updated: {new Date(content.lastUpdated).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCultural = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Cultural Adaptations</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {culturalAdaptations.map(adaptation => (
          <div key={adaptation.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{adaptation.region}</h3>
                <p className="text-sm text-gray-500">{adaptation.category.replace('_', ' ')}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                adaptation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {adaptation.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">{adaptation.description}</p>
              
              <div className="space-y-2">
                {Object.entries(adaptation.settings).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                    <span className="font-medium text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Settings
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTranslations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Translation Projects</h2>
        <button 
          onClick={() => createTranslationProject('New Project', 'en')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>

      <div className="space-y-6">
        {translationProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-500">Language: {project.language.toUpperCase()}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                project.status === 'review' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium text-gray-900">{project.progress.total}</p>
                </div>
                <div>
                  <p className="text-gray-500">Translated</p>
                  <p className="font-medium text-gray-900">{project.progress.translated}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reviewed</p>
                  <p className="font-medium text-gray-900">{project.progress.reviewed}</p>
                </div>
                <div>
                  <p className="text-gray-500">Approved</p>
                  <p className="font-medium text-gray-900">{project.progress.approved}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((project.progress.approved / project.progress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(project.progress.approved / project.progress.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Contributors</p>
              <div className="flex flex-wrap gap-1">
                {project.contributors.map(contributor => (
                  <span key={contributor} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {contributor}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Manage
                </button>
                <button className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Multi-Language & Localization</h1>
          <p className="text-gray-600 mt-2">
            Manage internationalization, regional settings, and cultural adaptations for global users
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'languages', label: 'Languages' },
              { id: 'regions', label: 'Regional Settings' },
              { id: 'content', label: 'Localized Content' },
              { id: 'cultural', label: 'Cultural Adaptations' },
              { id: 'translations', label: 'Translation Projects' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'languages' && renderLanguages()}
            {activeTab === 'regions' && renderRegions()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'cultural' && renderCultural()}
            {activeTab === 'translations' && renderTranslations()}
          </div>
        )}
      </div>
    </div>
  );
} 