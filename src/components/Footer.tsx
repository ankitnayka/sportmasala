import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-sidebar border-t border-card-border mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold text-foreground">T20<span className="text-accent">Masala</span></span>
                        <p className="text-sm text-gray-500 mt-2">Your daily dose of Sports and Geopolitics.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/about" className="text-sm text-gray-500 hover:text-foreground">
                            About
                        </Link>
                        <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-gray-500 hover:text-foreground">
                            Terms & Conditions
                        </Link>
                        <Link href="/contact" className="text-sm text-gray-500 hover:text-foreground">
                            Contact
                        </Link>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} T20 Masala. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
