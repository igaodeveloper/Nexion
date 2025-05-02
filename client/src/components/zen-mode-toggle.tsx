import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';
import { useZenMode } from '@/lib/zen-mode-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ZenModeToggleProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
}

export function ZenModeToggle({ 
  className, 
  variant = 'outline',
  showLabel = false
}: ZenModeToggleProps) {
  const { zenMode, toggleZenMode } = useZenMode();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={showLabel ? "sm" : "icon"}
            onClick={toggleZenMode}
            className={cn(
              showLabel ? "gap-2" : "",
              className
            )}
          >
            {zenMode ? (
              <>
                <Minimize className="h-4 w-4" />
                {showLabel && <span>Sair do Modo Foco</span>}
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" />
                {showLabel && <span>Modo Foco</span>}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>
            {zenMode ? 'Sair do Modo Foco (Esc)' : 'Modo Foco Total (Ctrl+Shift+Z)'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 