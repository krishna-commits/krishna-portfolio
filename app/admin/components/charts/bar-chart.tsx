'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface AdminBarChartProps {
  data: BarChartData[];
  title?: string;
  description?: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
  stacked?: boolean;
}

export function AdminBarChart({
  data,
  title,
  description,
  dataKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b'],
  height = 300,
  stacked = false,
}: AdminBarChartProps) {
  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        <XAxis 
          dataKey="name" 
          className="text-xs fill-slate-600 dark:fill-slate-400"
          stroke="#64748b"
        />
        <YAxis 
          className="text-xs fill-slate-600 dark:fill-slate-400"
          stroke="#64748b"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-lg">
                  {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm text-slate-900 dark:text-slate-50">
                      {`${entry.name}: ${entry.value}`}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar 
            key={key}
            dataKey={key} 
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  if (title) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {chartContent}
        </CardContent>
      </Card>
    );
  }

  return chartContent;
}

