import React, {useContext} from 'react';
import {Context} from "../../index";
import {Navigate, Outlet} from "react-router-dom";
import {observer} from "mobx-react-lite";

const IsAuth = ({children}
) => {
    const {store} = useContext(Context);
    if (!store.isAuth) {
        return <Navigate to={'/login'} replace/>;
    }
    return children ? children : <Outlet/>;
};

export default observer(IsAuth);