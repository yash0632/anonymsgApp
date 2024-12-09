import NavPageComponent from "@/components/NavPageComponent";

export default function homeLayout({
    children
}: Readonly<{
    children: React.ReactNode;
  }>){
    return (
        <div className="h-screen p-2">
            <NavPageComponent/>
            {children}
        </div>
    )
}