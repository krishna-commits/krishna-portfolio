'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';

interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface AdminLineChartProps {
  data: LineChartData[];
  title?: string;
  description?: string;
  dataKey: string;
  color?: string;
  height?: number;
  suffix?: string; // Suffix to append to values (e.g., '%', 'MB')
}

export function AdminLineChart({
  data,
  title,
  description,
  dataKey,
  color = '#3b82f6',
  height = 300,
  suffix = '',
}: AdminLineChartProps) {
  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        <XAxis 
          dataKey="name" 
          className="text-xs fill-slate-600 dark:fill-slate-400"
          stroke="#64748b"
        />
        <YAxis 
          className="text-xs fill-slate-600 dark:fill-slate-400"
          stroke="#64748b"
          tickFormatter={(value) => `${value}${suffix}`}
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
                      {`${entry.name}: ${entry.value}${suffix}`}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
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

