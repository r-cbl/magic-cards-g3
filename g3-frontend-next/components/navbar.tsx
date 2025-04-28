"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogIn, WalletCardsIcon as Cards, BookOpen, PlusCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout } from "@/lib/userSlice"

export default function Navbar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.user)
  const isLoggedIn = !!currentUser

  const handleLogout = () => {
    dispatch(logout())
    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
              alt="PokéTrade Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold">PokéTrade</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link
              href="/cards"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/cards" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Cards
            </Link>
            <Link
              href="/publications"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/publications" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Publications
            </Link>
            {isLoggedIn && (
              <Link
                href="/my-offers"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/my-offers" ? "text-primary" : "text-muted-foreground",
                )}
              >
                My Offers
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/cards/create">
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/cards">
                  <Cards className="mr-2 h-4 w-4" />
                  Cards
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/publications">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Publications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
