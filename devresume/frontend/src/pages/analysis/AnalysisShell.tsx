import AnalysisLayout from '@/layouts/AnalysisLayout'
import { useReviewStore } from '@/store/review.store'
import OverviewPage from './OverviewPage'
import ATSPage from './ATSPage'
import SkillsPage from './SkillsPage'
import ProjectsPage from './ProjectsPage'
import InsightsPage from './InsightsPage'

export default function AnalysisShell() {
  const { activeTab } = useReviewStore()

  return (
    <AnalysisLayout>
      {activeTab === 'overview'  && <OverviewPage />}
      {activeTab === 'ats'       && <ATSPage />}
      {activeTab === 'skills'    && <SkillsPage />}
      {activeTab === 'projects'  && <ProjectsPage />}
      {activeTab === 'insights'  && <InsightsPage />}
    </AnalysisLayout>
  )
}
