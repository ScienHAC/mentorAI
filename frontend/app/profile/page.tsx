import Dashboard from "@/components/profileUi/Dashboard"
import { Space_Mono } from "next/font/google"
import Link from "next/link"

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] })

export default function Profile() {
    return (
        <div className="h-screen flex flex-col">
            <header className="container mx-auto px-4 py-4 md:py-6 flex items-center">
                {/* Logikxmind aligned left and linked to home */}
                <Link href="/" className={` md:text-2xl text-bold text-2xl text-emerald-600 font-bold ${spaceMono.className} ml-14 sm:ml-12 md:ml-0 mr-auto`}>
                    Logikxmind
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden sm:flex space-x-4">
                    <Link href="/" className="hover:underline font-semibold">
                        Home
                    </Link>
                    <Link href="/about" className="hover:underline">
                        About
                    </Link>
                </nav>
            </header>

            {/* Restrict scrolling to Dashboard */}
            <div className="flex-1 overflow-auto">
                <Dashboard />
            </div>
        </div>
    );
}