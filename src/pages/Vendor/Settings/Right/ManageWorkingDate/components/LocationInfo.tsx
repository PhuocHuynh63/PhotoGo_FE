import { MapPin } from 'lucide-react'

interface LocationInfoProps {
    address?: string
    ward?: string
    district?: string
    city?: string
}

const LocationInfo = ({ address, ward, district, city }: LocationInfoProps) => {
    return (
        <div className="bg-slate-50 p-3 rounded-md">
            <div className="flex items-center gap-2 text-slate-700 mb-1">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="font-medium">Địa điểm:</span>
            </div>
            <p className="text-sm text-slate-600 ml-6">
                {address}, {ward}, {district}, {city}
            </p>
        </div>
    )
}

export default LocationInfo 