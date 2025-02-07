import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

const SeparatorWithOr = async ({ children }: { children?: ReactNode }) => {
  const t = await getTranslations('Locale')
  return (
    <div className='h-5 border-b my-5 text-center w-full'>


      <span className='bg-background absolute left-1/2 -translate-x-1/2 mt-2 text-gray-500'>
        {children ?? t('or')}
      </span>
    </div>

  )
}

export default SeparatorWithOr
