import {Route, Routes} from "react-router-dom";
import PostsPage from "./pages/posts/PostsPage";
import PostPage from "./pages/posts/PostPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import IsAuth from "./components/utils/IsAuth";
import CreateUpdatePostPage from "./pages/posts/CreateUpdatePostPage";
import {observer} from "mobx-react-lite";
import UsersTablePage from "./pages/users/UsersTablePage";
import LogoutComponent from "./components/utils/LogoutComponent";
import Profile from "./pages/users/Profile";
import Settings from "./pages/users/Settings";
import Page404 from "./pages/Page404";
import SystemProperies from "./pages/admin/SystemProperies";
import UserDeleted from "./pages/UserDeleted";
import Securities from "./pages/securities/Securities";
import SecurityPage from "./pages/securities/SecurityPage";
import NewsPage from "./pages/posts/NewsPage";


function App() {
    return (
        <Routes>
            <Route path={'/login'} element={<LoginPage/>}/>
            <Route path={'/register'} element={<RegisterPage/>}/>
            <Route element={<IsAuth/>}>
                <Route path="/" element={<Securities/>}/>
                <Route path={'/posts'} element={<PostsPage/>}/>
                <Route path={'/news'} element={<NewsPage/>}/>

                <Route path={'/posts/create'} element={<CreateUpdatePostPage/>}/>
                <Route path={'/posts/update/:postId'} element={<CreateUpdatePostPage/>}/>
                <Route path={'/posts/:postId'} element={<PostPage/>}/>

                <Route path={'/users/settings'} element={<Settings/>}/>
                <Route path={'/users/null'} element={<UserDeleted/>}/>
                <Route path={'/users/:username'} element={<Profile/>}/>

                <Route path={'/users'} element={<UsersTablePage/>}/>
                <Route path={'/system-properties'} element={<SystemProperies/>}/>
                <Route path={'/securities'} element={<Securities/>}/>
                <Route path={'/securities/history/:securityId'} element={<SecurityPage/>}/>

                <Route path={'/404'} element={<Page404/>}/>

                <Route path={'/logout'} element={<LogoutComponent/>}/>
            </Route>
        </Routes>
    )
        ;
}

export default observer(App);
