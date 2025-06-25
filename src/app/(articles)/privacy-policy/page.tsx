import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="font-bold text-2xl">
              Noted
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">Privacy Policy</h1>

        <section className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
          <p>
            At Noted ("we," "our," "us"), we are committed to protecting the privacy and security of your information.
            This Privacy Policy outlines how we collect, use, disclose, and safeguard Protected Health Information (PHI)
            and other data in compliance with the Health Insurance Portability and Accountability Act (HIPAA). By using
            our services, you agree to the terms outlined in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Scope</h2>
          <p>
            This Privacy Policy applies to all users of our HIPAA-compliant software-as-a-service (SaaS) platform
            designed for home health care providers in the state of Florida. Our platform is accessible only to
            authorized personnel, such as healthcare providers, administrators, and nurses.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data We Collect</h2>
          <p>We collect and process the following types of information:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Protected Health Information (PHI):</strong>
              <ul className="list-disc pl-6">
                <li>Patient names (entered by users).</li>
                <li>Disabilities, goals, progress notes, and other health-related information.</li>
              </ul>
            </li>
            <li>
              <strong>User Information:</strong>
              <ul className="list-disc pl-6">
                <li>Names and email addresses of authorized users (e.g., Company Admins or Nurses).</li>
              </ul>
            </li>
            <li>
              <strong>System Data:</strong>
              <ul className="list-disc pl-6">
                <li>Metadata such as IP addresses, timestamps, and audit logs for security purposes.</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Data</h2>
          <p>We use the information collected for the following purposes:</p>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our platform's functionality.</li>
            <li>To generate billable summaries using AI-powered processing.</li>
            <li>To ensure compliance with applicable laws and regulations.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">De-identification Practices</h2>
          <p>
            Before transmitting data to third-party service providers for processing, we take the following steps to
            de-identify PHI:
          </p>
          <ul className="list-disc pl-6">
            <li>Patient names are removed from structured fields.</li>
            <li>
              Free-form text fields (e.g., nurse notes) are scanned using automated tools to redact identifiable names
              or other sensitive information where feasible.
            </li>
            <li>
              The remaining data contains only disabilities, goals, progress updates, and other non-identifiable
              health-related information.
            </li>
          </ul>
          <p className="font-semibold mt-4">
            Important Note: While we make every effort to redact identifying information from free-form text fields, we
            cannot guarantee that all names or identifiers will be fully removed due to human input variability.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Service Providers</h2>
          <p>
            To deliver our services effectively, we rely on third-party providers who operate under signed Business
            Associate Agreements (BAAs) as required by HIPAA:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Hosting Provider:</strong> We use a HIPAA-compliant hosting provider for secure data storage and
              processing.
            </li>
            <li>
              <strong>AI Service Provider:</strong> We utilize a third-party AI service to process nurse-generated notes
              into billable summaries. Data sent for processing is de-identified where possible and handled securely
              through non-retention routes.
            </li>
          </ul>
          <p>
            These providers are contractually obligated to comply with HIPAA regulations and implement robust security
            measures to protect your data.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Ownership</h2>
          <p>
            All PHI entered into our platform remains the property of the Covered Entity (e.g., healthcare provider or
            organization). We act solely as a processor of this data on behalf of the Covered Entity.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Security Measures</h2>
          <p>We implement industry-standard administrative, technical, and physical safeguards to protect your data:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Encryption:</strong> All PHI is encrypted at rest and in transit using NIST-approved standards.
            </li>
            <li>
              <strong>Access Controls:</strong> Role-based access controls ensure that users can only access data
              relevant to their role.
            </li>
            <li>
              <strong>Audit Logs:</strong> Comprehensive logs track all access to PHI for compliance purposes.
            </li>
            <li>
              <strong>Authentication:</strong> Multi-factor authentication is required for all user accounts.
            </li>
            <li>
              <strong>Monitoring:</strong> Regular vulnerability assessments and penetration testing are conducted to
              identify and mitigate risks.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Breach Notification</h2>
          <p>In the event of a data breach involving PHI:</p>
          <ul className="list-disc pl-6">
            <li>We will notify affected Covered Entities within 60 calendar days of discovering the breach.</li>
            <li>
              Notifications will include details about the breach's nature, affected data, mitigation steps taken, and
              recommendations for further actions.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Cookies</h2>
          <p>
            Our platform uses cookies solely for session management purposes. These cookies do not track users or
            collect any personal information beyond what is necessary for secure access.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Retention</h2>
          <p>
            We retain PHI for a minimum of six years in compliance with HIPAA regulations unless otherwise directed by
            the Covered Entity or required by law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">User Rights</h2>
          <p>Authorized users have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access PHI stored in our platform upon request by contacting their organization's administrator.</li>
            <li>Request amendments or corrections to PHI through their organization's administrator.</li>
            <li>Obtain an accounting of disclosures of their PHI as required under HIPAA.</li>
          </ul>
          <p className="mt-4">
            Note: Requests related to PHI must be submitted through the Covered Entity responsible for managing patient
            records on our platform.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or concerns about how your information is handled, please
            contact us at:
          </p>
          <p className="font-semibold">
            Email:{" "}
            <a href="mailto:support@notedfl.com" className="text-primary hover:underline">
              support@notedfl.com
            </a>
          </p>
          <p>We currently provide support exclusively via email.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in laws, regulations, or our
            practices. Significant changes will be communicated via email or platform notifications before they take
            effect.
          </p>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 mx-auto">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left text-gray-500">
              © {new Date().getFullYear()} Noted. All rights reserved.
            </p>
          </div>
          <nav className="flex items-center space-x-4 text-sm font-medium text-gray-500">
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

