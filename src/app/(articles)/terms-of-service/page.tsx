import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">Terms of Service</h1>

        <section className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
          <p>
            Welcome to Noted ("we," "our," "us"). These Terms of Service ("Terms") govern your use of our
            HIPAA-compliant software-as-a-service (SaaS) platform designed for home health care providers ("Service").
            By accessing or using the Service, you agree to comply with these Terms. If you do not agree, please do not
            use the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Definitions</h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Protected Health Information (PHI):</strong> Individually identifiable health information as
              defined under HIPAA.
            </li>
            <li>
              <strong>Business Associate Agreement (BAA):</strong> A legal contract between us and a Covered Entity
              outlining responsibilities for safeguarding PHI.
            </li>
            <li>
              <strong>Covered Entity:</strong> A healthcare provider or organization subject to HIPAA regulations.
            </li>
            <li>
              <strong>User Roles:</strong> Includes Company Admins, Nurses, and other authorized personnel accessing
              PHI.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">HIPAA Compliance</h2>
          <p>
            We are a Business Associate under the Health Insurance Portability and Accountability Act (HIPAA). As such:
          </p>
          <ul className="list-disc pl-6">
            <li>
              We will safeguard all PHI in compliance with the HIPAA Privacy, Security, and Breach Notification Rules.
            </li>
            <li>
              We will sign a BAA with each Covered Entity using our Service. The terms of the BAA are incorporated into
              this Agreement by reference.
            </li>
            <li>
              We will implement administrative, technical, and physical safeguards to protect PHI, including:
              <ul className="list-disc pl-6 mt-2">
                <li>Encryption of PHI at rest and in transit using NIST-approved standards.</li>
                <li>Multi-factor authentication for user access.</li>
                <li>Role-based access controls to limit PHI access to authorized personnel.</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">User Roles and Responsibilities</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">Company Admins:</h3>
          <ul className="list-disc pl-6">
            <li>Manage user access and ensure compliance with HIPAA rules within their organization.</li>
            <li>Conduct regular audits of user activity logs provided by the platform.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Nurses:</h3>
          <ul className="list-disc pl-6">
            <li>Access only assigned patient records and maintain confidentiality.</li>
            <li>Report any unauthorized access or security incidents immediately.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Noted:</h3>
          <ul className="list-disc pl-6">
            <li>Provide audit logs tracking all access to PHI.</li>
            <li>
              Notify Covered Entities of any breach involving PHI within 60 days as required by the Breach Notification
              Rule.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Processing and Ownership</h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Data Ownership:</strong> All PHI entered into the platform remains the property of the Covered
              Entity. We act solely as a processor of this data.
            </li>
            <li>
              <strong>Anonymized AI Processing:</strong> Any data processed using AI tools is anonymized where possible
              and handled securely.
            </li>
            <li>
              <strong>Audit Trails:</strong> Comprehensive logs are maintained for all actions involving PHI to support
              compliance investigations.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Security Measures</h2>
          <p>We employ stringent security measures, including:</p>
          <ul className="list-disc pl-6">
            <li>Role-based access controls ensuring users can only access data relevant to their role.</li>
            <li>End-to-end encryption for all PHI during storage and transmission.</li>
            <li>Regular vulnerability assessments and penetration testing.</li>
            <li>
              Physical security measures for servers hosting PHI, including restricted access and disaster recovery
              protocols.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Breach Notification</h2>
          <p>In the event of a data breach involving PHI:</p>
          <ul className="list-disc pl-6">
            <li>We will notify affected Covered Entities within 60 calendar days of discovery.</li>
            <li>
              We will provide detailed information on the breach's nature, affected data, mitigation steps taken, and
              recommendations for further actions.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Business Associate Agreement (BAA)</h2>
          <p>The BAA governs our obligations regarding PHI protection. Key terms include:</p>
          <ul className="list-disc pl-6">
            <li>Restrictions on the use or disclosure of PHI except as permitted under HIPAA or required by law.</li>
            <li>Obligations to return or destroy all PHI upon termination unless infeasible.</li>
            <li>Cooperation with Covered Entities during audits or investigations by regulatory bodies.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Administrative Safeguards</h2>
          <ul className="list-disc pl-6">
            <li>Workforce training on HIPAA compliance is conducted regularly for all employees handling PHI.</li>
            <li>
              Policies are in place for incident response, risk management, and reporting unauthorized disclosures.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Physical Safeguards</h2>
          <ul className="list-disc pl-6">
            <li>
              Data centers hosting PHI are secured with controlled access systems, surveillance cameras, and
              environmental protections against disasters.
            </li>
            <li>Devices used to access PHI are monitored for compliance with security policies.</li>
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
            <li>
              The Company is responsible for ensuring proper use of the Service in compliance with applicable laws.
            </li>
            <li>We are not liable for breaches caused by user negligence or failure to follow security protocols.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
          <p>Upon termination:</p>
          <ul className="list-disc pl-6">
            <li>All access to PHI will be revoked immediately.</li>
            <li>
              We will return or securely destroy all PHI as specified in the BAA unless otherwise required by law.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Amendments</h2>
          <p>
            We reserve the right to update these Terms as necessary to comply with changes in laws or regulations or
            improve our Service. Users will be notified of significant changes via email or platform notifications.
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

