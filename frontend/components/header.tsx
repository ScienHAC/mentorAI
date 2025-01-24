"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Space_Mono } from "next/font/google"

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] })

const Header = () => {
    const { theme, setTheme } = useTheme()
    return (
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className={`text-2xl font-bold lowercase ${spaceMono.className}`}>logikxmind</h1>
            <nav className="space-x-4">
                <Link href="/" className="hover:underline font-semibold">
                    Home
                </Link>
                <Link href="/about" className="hover:underline">
                    About
                </Link>
            </nav>
            <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:underline font-semibold">
                    Login
                </Link>
                <span>/</span>
                <Button asChild>
                    <Link href="/signup">Sign up</Link>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle dark mode"
                >
                    {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                </Button>
            </div>
        </header>
    )
}

export default Header

