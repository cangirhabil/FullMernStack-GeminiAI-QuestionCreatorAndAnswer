'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/components/providers/lang-provider';
import { AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ApiKeyWarning() {
  const { t } = useLang();
  const router = useRouter();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        setHasApiKey(data.hasApiKey);
      }
    } catch (error) {
      console.error('Error checking API key:', error);
      setHasApiKey(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  if (loading || hasApiKey) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-red-800 mb-2">{t('profile_apiKeyRequired')}</h4>
            <p className="text-red-700 text-sm mb-4">{t('profile_apiKeyRequiredDesc')}</p>
            <Button 
              onClick={handleGoToProfile}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('menu_profile')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
