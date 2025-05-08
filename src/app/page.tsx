"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { create } from "domain";

export default function Home() {
  const files = useQuery(api.files.getFiles)
  const createFile = useMutation(api.files.createFile)
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button>Sign out</Button>
          </SignOutButton>
        </SignedIn>
        
        {files?.map(file => {
          return <div key={file._id}>{file.name}</div>
        })}
        <Button onClick={() =>
          createFile({
            name: "hello",
          })
        }>Click</Button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
