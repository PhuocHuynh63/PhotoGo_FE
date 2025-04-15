
import SummaryCard from "@components/Molecules/CardSummary"

interface CardData {
  title: string
  icon: React.ReactNode
  value: string | number
  change: string
  changeColor?: string
  changeIcon?: React.ReactNode
  subtitle?: string
}

interface SummaryCardGroupProps {
  data: CardData[]
}

export default function SummaryCardGroup({ data }: SummaryCardGroupProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  )
}
