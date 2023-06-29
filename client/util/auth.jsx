import React from "react";
import alovaInstance from "./alova"
let userData = window.sessionStorage.getItem("_user")
try {
    userData = JSON.parse(userData)
} catch (e) {
    userData = null
}
export const AuthContext = React.createContext(null);
export default function AuthProvider({ children }) {

    let [user, setUser] = React.useState(userData);
    let signin = (signUser, callback) => {
        alovaInstance.Post("api/app", {
            ...signUser
        }).send().then(function (data) {
            setUser(data)
            window.sessionStorage.setItem("_user", JSON.stringify(data))
            callback && callback(data)
        })
    };

    let signout = (callback) => {
        alovaInstance.Put("api/app", {
            parmas: {
                ...user
            }
        }).send().then(function (data) {
            setUser(null)
            window.sessionStorage.removeItem("_user")
            callback && callback(data)
        })
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



//从sessionstorage 获取用户信息
export const getUser = function () {
    let user = window.sessionStorage.getItem("_user")
    try {
        user = JSON.parse(user)
    } catch (e) {
        user = null
    }
    return user
}