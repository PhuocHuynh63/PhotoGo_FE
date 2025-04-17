'use client'

import { Dialog, DialogContent, DialogHeader } from '@components/Atoms/Dialog'
import React from 'react'

type ViewConceptProps = {
    isOpen: boolean
    onOpenChange?: (open: boolean) => void
}

const ViewConcept = ({ isOpen, onOpenChange }: ViewConceptProps) => {

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogHeader title="View Concept" />
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="concept-name">Concept Name</label>
                        <input
                            type="text"
                            id="concept-name"
                            className="border border-gray-300 rounded p-2"
                            placeholder="Enter concept name"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="concept-description">Concept Description</label>
                        <textarea
                            id="concept-description"
                            className="border border-gray-300 rounded p-2"
                            placeholder="Enter concept description"
                        ></textarea>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default ViewConcept