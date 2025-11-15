'use client';

import { Card, CardContent, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from 'app/theme/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient = 'from-blue-500 to-cyan-500',
  iconColor = 'text-blue-500',
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br", gradient, "opacity-10 rounded-full -mr-16 -mt-16")} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate pr-2">
            {title}
          </CardTitle>
          <div className={cn("p-1.5 sm:p-2 rounded-lg bg-gradient-to-br flex-shrink-0", gradient, "bg-opacity-10")}>
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconColor)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 flex-wrap">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              {value}
            </div>
            {trend && (
              <div className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

