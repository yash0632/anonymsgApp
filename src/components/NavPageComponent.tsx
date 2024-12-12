"use client";
import React from "react";

import NavBar, { NavBarItems } from "./NavBar";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const NavPageComponent = () => {
  const router = useRouter();
  const session = useSession();

  React.useEffect(() => {
    if(session.status != "loading"){
      if(!session.data || !session.data.user){
        router.replace("/sign-in")
      }
    }
  }, [session]);

  return (
    
      <div className='max-h-fit p-2'>
        <NavBar>
          <NavBarItems linkValue="dashboard" value="Home"></NavBarItems>
          <Button
            onClick={() => {
              router.replace("/sign-out");
            }}
          >
            LogOut
          </Button>
        </NavBar>
      </div>
    
  );
};

export default NavPageComponent;
