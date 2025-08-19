"use client";

import { RefreshCw, User, FileText, Clock, Wifi, Server, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/lang-provider";
import { useRouter } from "next/navigation";

export interface ErrorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errorType: 'apiKey' | 'document' | 'rateLimit' | 'network' | 'server' | 'unknown';
  onRetry?: () => void;
}

export function ErrorDialog({ isOpen, onOpenChange, errorType, onRetry }: ErrorDialogProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const errorConfig = {
    apiKey: {
      icon: User,
      title: t("error_generation_apiKey"),
      description: t("error_generation_apiKeyDesc"),
      actionText: t("error_generation_apiKeyAction"),
      actionDesc: t("error_generation_apiKeyActionDesc"),
      action: () => {
        onOpenChange(false);
        router.push('/profile');
      },
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      showRetry: false,
    },
    document: {
      icon: FileText,
      title: t("error_generation_document"),
      description: t("error_generation_documentDesc"),
      actionText: t("error_generation_documentAction"),
      actionDesc: t("error_generation_documentActionDesc"),
      action: () => onOpenChange(false),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      showRetry: false,
    },
    rateLimit: {
      icon: Clock,
      title: t("error_generation_rateLimit"),
      description: t("error_generation_rateLimitDesc"),
      actionText: t("error_generation_rateLimitAction"),
      actionDesc: t("error_generation_rateLimitActionDesc"),
      action: onRetry,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      showRetry: true,
    },
    network: {
      icon: Wifi,
      title: t("error_generation_network"),
      description: t("error_generation_networkDesc"),
      actionText: t("error_generation_networkAction"),
      actionDesc: "",
      action: onRetry,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      showRetry: true,
    },
    server: {
      icon: Server,
      title: t("error_generation_server"),
      description: t("error_generation_serverDesc"),
      actionText: t("error_generation_rateLimitAction"),
      actionDesc: "",
      action: onRetry,
      color: "text-red-600",
      bgColor: "bg-red-50",
      showRetry: true,
    },
    unknown: {
      icon: HelpCircle,
      title: t("error_generation_unknown"),
      description: t("error_generation_unknownDesc"),
      actionText: t("error_generation_networkAction"),
      actionDesc: "",
      action: onRetry,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      showRetry: true,
    },
  };

  const config = errorConfig[errorType];
  const IconComponent = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className={`w-6 h-6 ${config.color}`} />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600 leading-relaxed">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={config.action}
            className="w-full"
            variant={errorType === 'apiKey' ? 'default' : 'outline'}
          >
            {errorType === 'apiKey' && <User className="w-4 h-4 mr-2" />}
            {config.showRetry && <RefreshCw className="w-4 h-4 mr-2" />}
            {config.actionText}
          </Button>
          
          {config.actionDesc && (
            <p className="text-xs text-gray-500 text-center">
              {config.actionDesc}
            </p>
          )}
          
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full mt-2"
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
