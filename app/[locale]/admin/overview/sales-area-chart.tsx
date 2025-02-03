/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { Card, CardContent } from '@/components/ui/card'
import useColorStore from '@/hooks/use-color-store'
import { formatDateTime } from '@/lib/utils'
import { useTheme } from 'next-themes'
import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CustomTooltipProps } from '@/types'

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className='p-3 space-y-1'>
          <p className='font-medium'>
            {label && formatDateTime(new Date(label)).dateOnly}
          </p>
          <p className='text-primary text-xl font-bold'>
            <ProductPrice price={payload[0].value} plain />
          </p>
        </CardContent>
      </Card>
    )
  }
  return null
}

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor='middle'
      fill='currentColor'
      className='text-xs opacity-75'
    >
      {formatDateTime(new Date(payload.value)).dateOnly}
    </text>
  )
}

const STROKE_COLORS: { [key: string]: { [key: string]: string } } = {
  Red: { light: '#980404', dark: '#ff3333' },
  Green: { light: '#015001', dark: '#06dc06' },
  Gold: { light: '#ac9103', dark: '#f1d541' },
  Purple: { light: '#523E68', dark: '#7e609f' },
}

export default function SalesAreaChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { color } = useColorStore(theme)

  return (
    <ResponsiveContainer width='100%' height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='5%'
              stopColor={STROKE_COLORS[color.name][theme || 'light']}
              stopOpacity={0.2}
            />
            <stop
              offset='95%'
              stopColor={STROKE_COLORS[color.name][theme || 'light']}
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray='3 3'
          vertical={false}
          stroke='currentColor'
          strokeOpacity={0.1}
        />
        <XAxis
          dataKey='date'
          tick={<CustomXAxisTick />}
          interval={3}
          axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
          tickLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
        />
        <YAxis
          fontSize={12}
          tickFormatter={(value: number) => `$${value}`}
          axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
          tickLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey='totalSales'
          stroke={STROKE_COLORS[color.name][theme || 'light']}
          strokeWidth={2}
          fill='url(#colorGradient)'
          fillOpacity={1}
          isAnimationActive={true}
          animationBegin={0}
          animationDuration={1200}
          animationEasing='ease-out'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
