import { useState } from "react";
import { LockClosedIcon } from '@heroicons/react/solid'
import { useRouter } from "next/router";
import Cookie from "universal-cookie";

const cookie = new Cookie();//JWT Token保管用Cookie

export default function Auth(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);//ログインモードとレジスターモードを示すステート

    const login = async () => {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
            {
              method: "POST",
              body: JSON.stringify({ username: username, password: password }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => {
              if (res.status === 400) {
                throw "authentication failed";
              } else if (res.ok) {
                return res.json();
              }
            })
            .then((data) => {
              const options = { path: "/" };
              cookie.set("access_token", data.access, options);
            });
          router.push("/main-page");//main-pageへ遷移
        } catch (err) {
          alert(err);
        }
    };
    
    const authUser = async (e) => {
        e.preventDefault();
        if (isLogin) {
          login();
        } else {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
              method: "POST",
              body: JSON.stringify({ username: username, password: password }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              if (res.status === 400) {
                throw "authentication failed";
              }
            });
            login();
          } catch (err) {
            alert(err);
          }
        }
    };



    return (
        <div className="w-full max-w-md space-y-8">
        <div>
        <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white-900">
            {isLogin ? "Login" : "Sign up"}
        </h2>

        </div>
        <form className="mt-8 space-y-6" onSubmit={authUser}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px rounded-md shadow-sm">
            <div>
            
            <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="username"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
            />
            </div>
            <div>
            
            <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            </div>
        </div>

        <div className="flex items-center justify-center">


            <div className="text-sm">
            <span onClick={() => setIsLogin(!isLogin)} className="cursor-pointer lfont-medium text-white-600 hover:text-indigo-500">
                change mode ?
            </span>
            </div>
        </div>

        <div>
            <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            {isLogin ? "Login with JWT" : "Create new user"}
            </button>
        </div>
        </form>
    </div>
    );
}