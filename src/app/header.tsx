"use client"

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useClerk } from '@clerk/nextjs'

export function Header() {
    const { signOut } = useClerk()
    return <div className="border-b py-5 bg-gray-50">
        <div className="items-center container mx-auto justify-between flex">
            <div className="ml-30 font-bold">
                FutureCloud
            </div>
            <SignedOut>
                <SignInButton>
                    <Button>
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton>
                    <Button onClick={() => signOut({ redirectUrl: '/home' })}>
                        Sign Out
                    </Button>
                </SignOutButton>
            </SignedIn>
        </div>
    </div>
}