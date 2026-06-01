import { Metadata } from 'next'

export const metadata: Metadata = {
 title: 'Create Account | Tourongo - Travel Marketplace',
 description: 'Join Tourongo to discover authentic travel experiences with verified guides.',
 robots: {
 index: false,
 follow: false,
 },
}

export default function SignupLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return <>{children}</>
}
