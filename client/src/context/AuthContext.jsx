import { createContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("User");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [registerError, setregisterError] = useState(null);
    const [isregisterLoading, setisregisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [loginError, setloginError] = useState(null);
    const [isloginLoading, setisloginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    })

    // console.log("registerInfo", registerInfo);
    // console.log("UserState", user);
    // console.log("LoginInfo", loginInfo);

    useEffect(() => {
        const user = localStorage.getItem("User");
        // console.log("userLocal", JSON.parse(user));
        
        setUser(JSON.parse(user))
        // lấy người dùng lưu trên local đưa vào state setUser
    }, [])


    // kiểu dữ liễu sẽ đưa vào updateInfo và cập nhật nó lại vs setRegsiteInfo
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])

   // giống cái trên, cập nhật thông tin đăng nhập 
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])


    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        // console.log(registerInfo);

        setisregisterLoading(true);
        setregisterError(null)
        const response = await postRequest(`${baseUrl}/auth/register`, JSON.stringify(registerInfo))
        // console.log("Reponse", response);
        
        setisregisterLoading(false)

        if (response.error) {
            return setregisterError(response)
        }

        // đưa dữ liệu trả về đưa vào local
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)

    }, [registerInfo])


    // login user
    const loginUser = useCallback( async(e) => {
        e.preventDefault();

        setisloginLoading(true)
        setloginError(null)

        const response = await postRequest(`${baseUrl}/auth/login`, JSON.stringify(loginInfo));
        setisloginLoading(false)

        if(response.error) {
            return setloginError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [loginInfo])


    // logout user
    const logoutUser = useCallback(() => {
         localStorage.removeItem("User") // remove khỏi local
         setUser(null) // và set lại trạng thái user
    }, [])

    return <AuthContext.Provider 
    value={{ 
        user, 
        registerInfo, 
        updateRegisterInfo, 
        registerUser, 
        registerError, 
        isregisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isloginLoading,
        }}>
        {children}
    </AuthContext.Provider>
}