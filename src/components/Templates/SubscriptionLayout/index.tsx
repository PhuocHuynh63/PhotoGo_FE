'use client'

import React, { useEffect } from 'react'
import { IUser } from '@models/user/common.model'
import { useSetUser } from '@stores/user/selectors'

const SubscriptionLayoutClient = ({
    children,
    user,
}: {
    children: React.ReactNode;
    user: IUser | null;
}) => {

    /**
     * State to manage user
     */
    const setUser = useSetUser();

    useEffect(() => {
        if (user) {
            setUser(user);
        }
    }, [user, setUser]);
    //----------------------End----------------------//

    return (
        <>
            {children}
        </>
    )
}

export default SubscriptionLayoutClient