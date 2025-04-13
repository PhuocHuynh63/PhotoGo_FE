import LoginPage from "@pages/Auth/Login";
import userService from "@services/user";

export default async function Login() {
    const getAllUsers = await userService.getUser();

    return (
        <>
            <LoginPage
                data={getAllUsers.data.data}
            />
        </>
    );
}