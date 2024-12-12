"use client"
import React from 'react'
import NavBar,{ NavBarItems } from './NavBar'
import {useSession} from 'next-auth/react'
import { Button } from './ui/button'
import {useRouter} from 'next/navigation'
import { Loader2 } from 'lucide-react'

const NavPageComponent2 = () => {
    const session = useSession();
    const [isSignedIn,setIsSignedIn] = React.useState(false);
    const router = useRouter();

    React.useEffect(()=>{
        if(session.status != "loading"){
            if(session.data && session.data.user){
                setIsSignedIn(true);
            }
            else{
                setIsSignedIn(false);
            }
        }
    },[session])

    if(session.status == "loading"){
        return <></>
    }

    return (

        <div className='max-h-fit p-2'>
            <NavBar>
                <NavBarItems linkValue='/dashboard' value='Home'/>
                <Button onClick={()=>{
                    if(isSignedIn){
                        router.replace('/sign-out');
                    }
                    else{
                        router.replace('/sign-in')
                    }
                }}>
                    {isSignedIn == true ? 'LogOut' : 'LogIn'}
                </Button>
            </NavBar>
        </div>
    )
}

export default NavPageComponent2


//Home            LogIn/LogOut