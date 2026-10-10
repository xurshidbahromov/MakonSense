import React from 'react';
import { motion } from 'motion/react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface AnimatedTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  layoutId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const AnimatedTabs = <T extends string>({
  tabs,
  activeId,
  onChange,
  layoutId = 'animated-tab-pill',
  className = '',
  size = 'md',
  fullWidth = false,
}: AnimatedTabsProps<T>) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-4 text-xs sm:text-sm',
    lg: 'py-3 px-6 text-sm sm:text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  return (
    <div
      role="tablist"
      className={`relative p-1 rounded-full bg-black/[0.04] dark:bg-[#18181C] border border-black/[0.07] dark:border-white/[0.12] backdrop-blur-xl flex select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] ${
        fullWidth ? 'w-full' : 'inline-flex'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center justify-center gap-2 font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
              fullWidth ? 'flex-1' : ''
            } ${sizeClasses[size]} ${
              isActive
                ? 'text-[#111111] dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-full bg-white dark:bg-[#25252A] border border-black/[0.06] dark:border-white/[0.16] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(14,159,110,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              />
            )}

            {Icon && (
              <Icon
                className={`relative z-10 transition-colors duration-200 ${iconSizes[size]} ${
                  isActive
                    ? 'text-[#0E9F6E]'
                    : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                }`}
              />
            )}

            <span className="relative z-10 whitespace-nowrap">{tab.label}</span>

            {tab.badge && (
              <span
                className={`relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0E9F6E]/15 text-[#0E9F6E]'
                    : 'bg-black/[0.05] dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AnimatedTabs;
