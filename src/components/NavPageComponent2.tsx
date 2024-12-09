"use client"
import React from 'react'
import NavBar,{ NavBarItems } from './NavBar'
import {useSession} from 'next-auth/react'
import { Button } from './ui/button'
import {useRouter} from 'next/navigation'

const NavPageComponent2 = () => {
    const session = useSession();
    const isSignedIn = session.data?.user != null;
    const router = useRouter();

    return (
        <div className='max-h-fit p-2'>
            <NavBar>
                <NavBarItems linkValue='/' value='Home'/>
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