'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useLang } from '@/components/providers/lang-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleProfile = () => {
    router.push('/profile');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          {t('menu_profile')}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          {t('menu_logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
