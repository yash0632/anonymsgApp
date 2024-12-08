"use client"
import React,{useState} from 'react'
import Link from 'next/link'

const NavBar = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex justify-between p-2 items-center">
        {children}

    </div>
  )
}

export const NavBarItems = ({className,...props}:{className?:string,
    linkValue:string,
    value:string
}) => {
    const [value,setValue] = useState("");
    const [linkValue,setLinkValue] = useState("");
    const [hover,setHover] = useState(false);
    return (
        <div 
         className={`hover:bg-neutral-300 text-base  rounded-md  p-2   ${className}`}>
            <Link href={props.linkValue} >{props.value}</Link>
            
        </div>
    )
}



export default NavBar

/*

<NavBar>
    <NavBarItems
        <NavBarValue > 
        <NavBarLink>
    />
</NavBar>
 */


