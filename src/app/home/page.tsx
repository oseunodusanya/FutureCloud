"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
export default function HomePage() {
	const user = useUser()
	const userName = user.user?.firstName
	return (
		<main className="container mx-auto pt-12">
			<SignedIn>
				<div className="">
					<h1 className="text-3xl font-bold">Welcome to FutureCloud, {userName}!</h1>
					<div className="text-2xl pb-5">Your own personal Cloud Storage application with next generation AI features!</div>
					<ul className="text-2xl" style={{ listStyleType: 'circle' }}>
						<li>Click the double arrows to open the sidebar and get started with the future of cloud storage!</li>
						<li>Navigate to the Upload Files page to upload any of your files to the cloud. This page includes an AI assistant which can analyse the contents of your file before you upload them.</li>
						<li>Navigate to the View Files page to view and download your files</li>
						<li>Navigate to the Delete Files page to delete your files from the cloud</li>
					</ul>

				</div>
			</SignedIn>
			<SignedOut>
				<div className="flex justify-between items-center"></div>
				<div className="flex-1">
					<div className="text-2xl">Welcome to FutureCloud!</div>
					<div className="text-2xl">Please log in to access the rest of the application!</div>
				</div>
			</SignedOut>


		</main>
	)
}