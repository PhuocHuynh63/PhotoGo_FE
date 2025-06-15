import { Calendar } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/Atoms/ui/select'

interface YearSelectorProps {
    selectedYear: number
    years: number[]
    onYearChange: (year: number) => void
}

const YearSelector = ({ selectedYear, years, onYearChange }: YearSelectorProps) => {
    return (
        <div className="mb-6 flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-medium text-slate-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-black" />
                Năm:
            </span>
            <Select value={selectedYear?.toString()} onValueChange={(v) => onYearChange(Number(v))}>
                <SelectTrigger className="w-32 bg-white border-slate-200">
                    <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                    {years?.map((year) => (
                        <SelectItem key={year} value={year?.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default YearSelector 