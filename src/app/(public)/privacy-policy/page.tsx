
export const metadata = {
    title: 'Privacy Policy',
};

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 prose prose-lg prose-invert text-gray-300">
            <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Introduction</h2>
            <p>
                Welcome to T20 Masala. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit our website
                and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information We Collect</h2>
            <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> includes username if you register.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How We Use Your Data</h2>
            <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Cookies</h2>
            <p>
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
                If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">AdSense and Third-Party Advertising</h2>
            <p>
                We use third-party advertising companies to serve ads when you visit our Web site. These companies may use aggregated information
                (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to
                provide advertisements about goods and services of interest to you.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Us</h2>
            <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us.
            </p>
        </div>
    );
}
