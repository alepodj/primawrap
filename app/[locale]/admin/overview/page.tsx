import { Metadata } from 'next'
import OverviewReport from './overview-report'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}
const DashboardPage = async () => {
  return <OverviewReport />
}

export default DashboardPage
