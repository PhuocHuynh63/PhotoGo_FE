'use client'

import Button from '@components/Atoms/Button'
import React from 'react'
import styles from './index.module.scss'

const ButtonVendorDetail = ({ children, className, onClick, ...rest }: ICOMPONENTS.ButtonProps) => {
    return (
        <Button className={`border border-grey text-dark ${styles.buttonVendorDetail}`} onClick={onClick}>{children}</Button>
    )
}

export default ButtonVendorDetail