'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useLanguage } from '@/components/providers/lang-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { User, Key, Shield, AlertTriangle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [maskedApiKey, setMaskedApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        setHasApiKey(!!data.hasApiKey);
        setMaskedApiKey(data.maskedApiKey || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUpdateStatus('idle');
    setTestResult('idle');
    setTestMessage('');

    try {
      // If user entered a new key, test it first
      let keyIsValid = true;
      if (geminiApiKey) {
        setTestingKey(true);
        try {
          const testRes = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-test-api-key': geminiApiKey },
            body: JSON.stringify({ dryRun: true, mode: 'validation' }),
          });
          if (testRes.ok) {
            const data = await testRes.json();
            if (data.valid) {
              setTestResult('valid');
              setTestMessage('API key geçerli / Key valid');
            } else {
              keyIsValid = false;
              setTestResult('invalid');
              setTestMessage(data.error || 'API key geçersiz');
            }
          } else {
            keyIsValid = false;
            const data = await testRes.json().catch(()=>({}));
            setTestResult('invalid');
            setTestMessage(data.error || 'API key geçersiz');
          }
        } catch {
          keyIsValid = false;
          setTestResult('error');
          setTestMessage('Test hatası');
        } finally {
          setTestingKey(false);
        }
      }

      if (!keyIsValid) {
        setIsLoading(false);
        return; // Stop - don't save invalid key
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, geminiApiKey: geminiApiKey || undefined }),
      });

      if (response.ok) {
        setUpdateStatus('success');
        // Clear input only after successful save
        setGeminiApiKey('');
        await refreshUser();
        await fetchUserProfile();
      } else {
        setUpdateStatus('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed separate manual test handler; validation happens in submit

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header (aligned with dashboard style) */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) router.back(); else router.push('/');
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline-block">{t('back')}</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              {t('profile_title')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <NavigationMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero / Intro section styled like dashboard welcome */}
        <div className="mb-8 sm:mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                {t('profile_description')}
              </h2>
              {!hasApiKey && (
                <div className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                  <AlertTriangle className="w-5 h-5 text-yellow-300 mt-0.5" />
                  <p className="text-sm text-blue-50 leading-relaxed">{t('profile_apiKeyRequiredDesc')}</p>
                </div>
              )}
            </div>
            <div className="absolute -right-6 sm:-right-10 -top-6 sm:-top-10 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full" />
            <div className="absolute -right-2 sm:-right-4 -bottom-4 w-20 sm:w-28 h-20 sm:h-28 bg-white/5 rounded-full" />
          </div>
        </div>

        {/* Grid layout matching dashboard spacing */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Account Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-5 h-5 text-blue-600" /> {t('profile_personalInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-gray-600 tracking-wide">
                      {t('profile_name')}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('profile_namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-600 tracking-wide">
                      {t('profile_email')}
                    </Label>
                    <Input id="email" type="email" value={user.email} disabled className="bg-gray-50" />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500"
                  >
                    {isLoading ? t('common_saving') : t('profile_updateInfo')}
                  </Button>
                  {updateStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" /> {t('profile_updateSuccess')}
                    </div>
                  )}
                  {updateStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 text-xs">
                      <AlertTriangle className="w-4 h-4" /> {t('profile_updateError')}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>


          </div>

          {/* API + Instructions */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Key className="w-5 h-5 text-purple-600" /> {t('profile_apiKeyManagement')}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium ${hasApiKey ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}> 
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {hasApiKey ? t('profile_apiKeyActive') : t('profile_apiKeyRequired')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="apiKey" className="text-xs font-semibold text-gray-600 tracking-wide">
                        {t('profile_geminiApiKey')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showApiKey ? 'text' : 'password'}
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          placeholder={hasApiKey ? t('profile_apiKeyExists') : t('profile_apiKeyPlaceholder')}
                          className="pr-10"
                        />
                        {geminiApiKey && (
                          <button
                            type="button"
                            onClick={() => setShowApiKey(v => !v)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                      {geminiApiKey && testResult !== 'idle' && (
                        <div className="pt-2 text-xs font-medium">
                          <span className={
                            testResult === 'valid'
                              ? 'text-green-600'
                              : testResult === 'invalid'
                              ? 'text-red-600'
                              : 'text-orange-600'
                          }>
                            {testMessage}
                          </span>
                        </div>
                      )}
                    </div>
                    {hasApiKey && (
                      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                        <Shield className="w-4 h-4" /> {t('profile_apiKeyActive')}
                        <span className="text-xs font-mono">- {maskedApiKey}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-blue-200 bg-white p-4">
                      <h4 className="font-medium text-blue-700 mb-2 text-sm">{t('profile_howToGetApiKey')}</h4>
                      <ol className="list-decimal list-inside space-y-1 text-[13px] text-gray-600">
                        <li>{t('profile_step1')}</li>
                        <li>{t('profile_step2')}</li>
                        <li>{t('profile_step3')}</li>
                        <li>{t('profile_step4')}</li>
                      </ol>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="space-y-2 text-[13px] text-gray-600">
                        <p className="font-medium text-gray-800">{t('profile_apiKeyNote')}</p>
                        {!hasApiKey && (
                          <p className="text-red-700">{t('profile_apiKeyRequiredDesc')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      type="submit"
                      disabled={isLoading || testingKey}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                    >
                      {testingKey ? 'Test ediliyor...' : isLoading ? t('common_saving') : t('profile_updateApiKey')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
