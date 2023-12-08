import {useContext} from 'react';
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";

const LogoutComponent = () => {
    const {store} = useContext(Context);
    const navigate = useNavigate();
    store.logout();
    navigate('/login');
};

export default LogoutComponent;