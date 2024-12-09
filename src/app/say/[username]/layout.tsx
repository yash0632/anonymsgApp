import NavPageComponent2 from "@/components/NavPageComponent2";

export default function sayLayout(
    {children}:Readonly<{children:React.ReactNode}>
){
    return (
        <div className="min-h-screen">
            <NavPageComponent2/>
            {children}
        </div>
    )
}