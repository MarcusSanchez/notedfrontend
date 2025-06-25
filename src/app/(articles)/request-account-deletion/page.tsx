import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AccountDeletionPolicy() {
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
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">Account Deletion Policy</h1>

        <section className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">Requesting Account Deletion</h2>
          <p>
            To initiate the process of permanently deleting your account, please contact the administrator of your company's space within Noted. Here are the steps your administrator should follow:
          </p>
          <ul className="list-disc pl-6">
            <li><strong>Set your status to "Rejected":</strong> This action indicates that your account is no longer active and should be removed from the system.</li>
            <li><strong>Account Deletion:</strong> Once you are off the billing period, your administrator will proceed to delete your account.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Retention for Compliance</h2>
          <p>
            Please note that while your account will be permanently removed from our services, we are required to retain certain information for compliance and auditing purposes as we are a HIPAA-compliant solution:
          </p>
          <ul className="list-disc pl-6">
            <li>Username</li>
            <li>Full Name</li>
            <li>Email</li>
          </ul>
          <p>
            This data will be automatically deleted once the compliant retention period has passed, in accordance with HIPAA regulations.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Security Measures</h2>
          <p>We employ stringent security measures to ensure the protection of your data during the account deletion process:</p>
          <ul className="list-disc pl-6">
            <li>Role-based access controls to ensure only authorized personnel can initiate account deletions.</li>
            <li>End-to-end encryption for all data during storage and transmission.</li>
            <li>Regular vulnerability assessments and penetration testing to safeguard against unauthorized access.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Breach Notification</h2>
          <p>In the unlikely event of a data breach involving your information:</p>
          <ul className="list-disc pl-6">
            <li>We will notify affected Covered Entities within 60 calendar days of discovery.</li>
            <li>We will provide detailed information on the breach's nature, affected data, mitigation steps taken, and recommendations for further actions.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Administrative Safeguards</h2>
          <ul className="list-disc pl-6">
            <li>Workforce training on HIPAA compliance is conducted regularly for all employees handling PHI.</li>
            <li>Policies are in place for incident response, risk management, and reporting unauthorized disclosures.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Physical Safeguards</h2>
          <ul className="list-disc pl-6">
            <li>Data centers hosting PHI are secured with controlled access systems, surveillance cameras, and environmental protections against disasters.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Technical Safeguards</h2>
          <ul className="list-disc pl-6">
            <li>Systems include audit controls to log access to ePHI.</li>
            <li>Unique user IDs are assigned to track system activity effectively.</li>
            <li>Transmission security protocols prevent interception of ePHI during data transfers.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Limitations of Liability</h2>
          <p>While we take extensive measures to ensure HIPAA compliance:</p>
          <ul className="list-disc pl-6">
            <li>The Company is responsible for ensuring proper use of the Service in compliance with applicable laws.</li>
            <li>We are not liable for breaches caused by user negligence or failure to follow security protocols.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
          <p>Upon termination:</p>
          <ul className="list-disc pl-6">
            <li>All access to PHI will be revoked immediately.</li>
            <li>We will return or securely destroy all PHI as specified in the BAA unless otherwise required by law.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Amendments</h2>
          <p>
            We reserve the right to update this Account Deletion Policy as necessary to comply with changes in laws or regulations or to improve our Service. Users will be notified of significant changes via email or platform notifications.
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
