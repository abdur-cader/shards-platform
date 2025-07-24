import { Toaster } from "sonner"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>){
    return(
            <main className="font-work-sans">
                {children}
                <Toaster position="bottom-center"/>
            </main>
    )
}