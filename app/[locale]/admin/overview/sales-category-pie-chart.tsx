/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import useColorStore from '@/hooks/use-color-store'

type ColorName = 'Red' | 'Green' | 'Gold' | 'Purple'
type ThemeMode = 'light' | 'dark'

const COLORS: {
  [key: string]: { [key: string]: { base: string; light: string } }
} = {
  Red: {
    light: { base: '#980404', light: '#ff9999' },
    dark: { base: '#ff3333', light: '#ffcccc' },
  },
  Green: {
    light: { base: '#015001', light: '#99ff99' },
    dark: { base: '#06dc06', light: '#ccffcc' },
  },
  Gold: {
    light: { base: '#ac9103', light: '#fff5b3' },
    dark: { base: '#f1d541', light: '#fff9db' },
  },
  Purple: {
    light: { base: '#523E68', light: '#d4c6e6' },
    dark: { base: '#7e609f', light: '#e8e0f3' },
  },
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const percentage = (
      (payload[0].value / payload[0].payload.total) *
      100
    ).toFixed(0)
    return (
      <Card className='shadow-lg'>
        <CardContent className='p-4 space-y-2'>
          <p className='text-base font-semibold'>{payload[0].name}</p>
          <p className='text-primary text-2xl font-bold'>
            {payload[0].value} sales
          </p>
          <p className='text-sm opacity-75'>{`${percentage}% of total`}</p>
        </CardContent>
      </Card>
    )
  }
  return null
}

export default function SalesCategoryPieChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { color } = useColorStore(theme)
  const currentTheme = (theme || 'light') as ThemeMode
  const colorName = color.name as ColorName

  // Calculate percentages and sort data
  const total = data.reduce((sum, item) => sum + item.totalSales, 0)
  const dataWithPercentages = data
    .map((item) => ({
      ...item,
      percentage: (item.totalSales / total) * 100,
      total, // Add total to each data point for tooltip calculation
    }))
    .sort((a, b) => b.percentage - a.percentage)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = outerRadius * 1.35
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const mx = cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN)
    const my = cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN)
    const item = dataWithPercentages[index]

    return (
      <g
        style={{
          animation: `labelEnter 0.5s ease-out forwards ${index * 100}ms`,
          opacity: 0,
        }}
      >
        <path
          d={`M${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${
            cy + outerRadius * Math.sin(-midAngle * RADIAN)
          }L${mx},${my}L${x},${y}`}
          stroke={COLORS[colorName][currentTheme].base}
          strokeWidth={1.5}
          fill='none'
        />
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          className='text-sm font-semibold'
          fill='currentColor'
        >
          {`${item._id}`}
        </text>
        <text
          x={x}
          y={y + 20}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          className='text-sm'
          fill='currentColor'
        >
          {`${item.totalSales} sales`}
        </text>
        <text
          x={x}
          y={y + 38}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          className='text-sm font-medium text-primary'
          fill={COLORS[colorName][currentTheme].base}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={400}>
      <PieChart width={400} height={400}>
        <style>
          {`
            @keyframes pieEnter {
              from {
                transform: scale(0);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes labelEnter {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
        {dataWithPercentages.map((item, index) => (
          <defs key={`gradient-${index}`}>
            <linearGradient
              id={`pieGradient-${index}`}
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop
                offset='0%'
                stopColor={COLORS[colorName][currentTheme].base}
                stopOpacity={0.8 * ((100 - index * 25) / 100)}
              />
              <stop
                offset='100%'
                stopColor={COLORS[colorName][currentTheme].light}
                stopOpacity={0.3 * ((100 - index * 25) / 100)}
              />
            </linearGradient>
          </defs>
        ))}
        <Pie
          key={dataWithPercentages.map((d) => d.totalSales).join('-')}
          data={dataWithPercentages}
          dataKey='totalSales'
          nameKey='_id'
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={110}
          isAnimationActive={false}
          style={{
            animation: 'pieEnter 0.8s ease-out forwards',
            transformOrigin: 'center center',
          }}
        >
          {dataWithPercentages.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#pieGradient-${index})`}
              stroke={COLORS[colorName][currentTheme].base}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
