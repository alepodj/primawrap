'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { getMonthName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import useColorStore from '@/hooks/use-color-store'

type ColorName = 'Red' | 'Green' | 'Gold' | 'Purple'
type ThemeMode = 'light' | 'dark'

type TableChartProps = {
  labelType: 'month' | 'product'
  data: {
    label: string
    image?: string
    value: number
    id?: string
  }[]
}

import React from 'react'

interface ProgressBarProps {
  value: number
  className?: string
  theme?: string | null
  color: { name: ColorName }
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, theme, color }) => {
  const boundedValue = Math.min(100, Math.max(0, value))

  const getGradientColors = () => {
    const colors = {
      Red: { light: '#980404', dark: '#ff3333' },
      Green: { light: '#015001', dark: '#06dc06' },
      Gold: { light: '#ac9103', dark: '#f1d541' },
      Purple: { light: '#523E68', dark: '#7e609f' },
    } as const

    const currentTheme = (theme || 'light') as ThemeMode
    return colors[color.name][currentTheme]
  }

  return (
    <div className='relative w-full h-5 bg-muted rounded-lg overflow-hidden'>
      <div
        className='h-full rounded-lg'
        style={{
          width: `${boundedValue}%`,
          background: `linear-gradient(90deg, ${getGradientColors()}66, ${getGradientColors()})`,
          animation: 'growWidth 1s ease-out forwards',
        }}
      />
      <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium mix-blend-difference text-white'>
        {boundedValue}%
      </span>
    </div>
  )
}

export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const { theme } = useTheme()
  const { color } = useColorStore(theme)
  const max = Math.max(...data.map((item) => item.value))
  const dataWithPercentage = data.map((x, index) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
    delay: index * 100,
  }))

  return (
    <div className='space-y-4'>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes growWidth {
          from {
            width: 0%;
          }
        }
      `}</style>
      {dataWithPercentage.map(
        ({ label, id, value, image, percentage, delay }) => (
          <div
            key={label}
            className='grid grid-cols-[120px_1fr_100px] md:grid-cols-[250px_1fr_100px] gap-4 items-center hover:bg-muted/50 p-2 rounded-lg transition-colors group'
            style={{
              animation: `slideIn 0.6s ease-out forwards`,
              animationDelay: `${delay}ms`,
              opacity: 0,
            }}
          >
            {image ? (
              <Link
                className='flex items-center gap-3 group'
                href={`/admin/products/${id}`}
              >
                <div className='relative w-12 h-12 bg-background rounded-lg border overflow-hidden flex-shrink-0 group-hover:border-primary transition-colors'>
                  <Image
                    className='object-contain p-1'
                    src={image!}
                    alt={label}
                    fill
                    sizes='48px'
                  />
                </div>
                <p className='text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 flex-1 min-w-0'>
                  {label}
                </p>
              </Link>
            ) : (
              <div className='text-sm font-medium group-hover:text-primary transition-colors'>
                {label}
              </div>
            )}

            <ProgressBar
              value={percentage}
              theme={theme}
              color={{ name: color.name as ColorName }}
            />

            <div className='text-sm font-medium text-right group-hover:text-primary transition-colors'>
              <ProductPrice price={value} plain />
            </div>
          </div>
        )
      )}
    </div>
  )
}
