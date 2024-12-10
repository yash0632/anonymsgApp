"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const MessageCard = ({
  cardContent,
  createdAt,
  setDeleteMessageId,
  messageId
}: {
  cardContent: string,
  createdAt: Date,
  setDeleteMessageId:any,
  messageId:string
}) => {
  const date = new Date(createdAt);


  return (
    <div>
      <Card className="px-4  py-4">
        <CardHeader>
          <CardTitle>Message Card</CardTitle>

          <CardDescription>{`${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{cardContent}</p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col w-fit p-8 gap-y-8">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                
              </AlertDialogHeader>
              <AlertDialogFooter className=" flex items-center justify-between">
                
                <AlertDialogCancel >Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                  setDeleteMessageId(messageId)
                }}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MessageCard;

//content
//delete
