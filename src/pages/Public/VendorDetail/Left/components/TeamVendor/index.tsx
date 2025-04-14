import { useVendor } from '@lib/vendorContext'
import React from 'react'

const TeamVendor = () => {
    const vendorData = useVendor() as any
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vendorData?.team?.map((member: any) => (
                <div key={member.id} className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3">
                        <img src={member.avatar} alt={member.name} />
                        <p>{member.name.charAt(0)}</p>
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.experience}</p>
                </div>
            ))}
        </div>
    )
}

export default TeamVendor