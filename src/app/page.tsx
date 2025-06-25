"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  ClipboardList,
  HeadphonesIcon,
  Languages,
  LayoutDashboard,
  type LucideIcon,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/state";
import { useBreakpoints } from "@/hooks/use-breakpoints";

const mailtoSubjects = {
  getStarted: "Get Started: [Your Company Name]".replace(" ", "%20"),
  requestDemo: "Request a Live Demo: [Your Company Name]".replace(" ", "%20"),
};

export default function LandingPage() {
  const { user } = useUserStore();

  const theme = useTheme();
  const { isMD } = useBreakpoints();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    theme.setTheme("light");
  }, [theme]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(isMD);
  }, [isMD]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary mx-auto absolute left-1/2 right-1/2 transform -translate-x-1/2 w-full">
      {(isMD || !isMenuOpen) && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/" className="font-bold text-2xl">
                  Noted
                </Link>
              </div>
              <div className="-mr-2 -my-2 md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <span className="sr-only">Open menu</span>
                  {isMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <nav className="hidden md:flex space-x-10">
                <Link href="/#features" className="text-base font-medium hover:text-latte-text">
                  Features
                </Link>
                <Link href="/#pricing" className="text-base font-medium hover:text-latte-text">
                  Pricing
                </Link>
                <Link href="/#contact" className="text-base font-medium hover:text-latte-text">
                  Contact
                </Link>
              </nav>
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                <Link href="/login">
                  <Button variant="outline" className="ml-8 backgroundspace-nowrap">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="ml-4 backgroundspace-nowrap">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {isMenuOpen && (
        <div className="md:hidden sticky top-0 z-50 h-full border-b">
          <div className="h-screen bg-background">
            <div className="container mx-auto pt-[16px] px-4 sm:px-6 lg:px-8 spacing-0">
              <div className="flex justify-between lg:w-0 lg:flex-1">
                <div>
                  <Link href="/" className="font-bold text-2xl">
                    Noted
                  </Link>
                </div>
                <div className="-mr-2">
                  <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link href="/#features" className="text-base font-medium hover:text-latte-text" onClick={toggleMenu}>
                    Features
                  </Link>
                  <Link href="/#pricing" className="text-base font-medium hover:text-latte-text" onClick={toggleMenu}>
                    Pricing
                  </Link>
                  <Link href="/#contact" className="text-base font-medium hover:text-latte-text" onClick={toggleMenu}>
                    Contact
                  </Link>
                </nav>
              </div>
              <div className="mt-6 flex flex-col space-y-4">
                <Link href="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={toggleMenu}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
      }

      <main className="flex-grow mx-auto w-full">
        {/* Hero Section */}
        <section className="pt-20 pb-40 px-4 sm:px-6 lg:px-8 bg-latte-mantle">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block">Revolutionize Your</span>
                <span className="block text-latte-text">Home Health Care Notes</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-latte-subtext0 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Empower your nurses with AI-assisted note-taking. Simplify documentation, improve care, and save time
                with us.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  {user.loggedIn ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full">
                        {user.loggedIn ? "Go to dashboard" : "Get started"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`mailto:support@notedfl.com?subject=${mailtoSubjects.getStarted}`}
                    >
                      <Button size="lg" className="w-full">
                        {user.loggedIn ? "Go to dashboard" : "Get started"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`mailto:support@notedfl.com?subject=${mailtoSubjects.requestDemo}`}
                  className="rounded-md shadow sm:mt-0 sm:ml-3"
                >
                  <Button variant="outline" size="lg" className="w-full mt-3 sm:mt-auto">
                    Request a live demo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-sm:scroll-m-[50px] w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20">
              <div className="lg:text-center">
                <h2 className="text-base text-latte-text font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
                  A better way to manage health care notes
                </p>
                <p className="mt-4 max-w-2xl text-xl text-latte-subtext0 lg:mx-auto">
                  We provide cutting-edge tools to streamline your workflow and enhance patient care documentation.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                title="AI-Powered Note Generation"
                description="Transform concise inputs into comprehensive, professional notes using cutting-edge AI technology."
                Icon={BrainCircuit}
              />
              <FeatureCard
                title="Secure Data Storage"
                description="Your data is protected with state-of-the-art encryption and compliant with healthcare industry standards."
                Icon={Shield}
              />
              <FeatureCard
                title="Intelligent Workspace Management"
                description="Effortlessly manage your company, admins, nurses, and patients with our intuitive interface and smart organizational tools."
                Icon={LayoutDashboard}
              />
              <FeatureCard
                title="Language Agnostic"
                description="English not your nurses' native language? We support note-taking in any language, while outputting an english response."
                Icon={Languages}
              />
              <FeatureCard
                title="Templated Note-Taking"
                description="We tailor your note-taking process with templates for health activities, goals, behaviors, and safety measures."
                Icon={ClipboardList}
              />
              <FeatureCard
                title="Dedicated Expert Support"
                description="Our inboxes are always available to assist you, ensuring smooth operations and quick issue resolution."
                Icon={HeadphonesIcon}
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-sm:scroll-m-[50px] w-full py-12 md:py-24 lg:py-32 bg-latte-mantle">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20">
              <div className="lg:text-center">
                <h2 className="text-base text-latte-text font-semibold tracking-wide uppercase">Pricing</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
                  Simple, transparent pricing
                </p>
                <p className="mt-4 max-w-2xl text-xl text-latte-subtext0 lg:mx-auto">
                  Choose the plan that's right for your team
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                title="Starter"
                price="flat $300/month"
                description="Minimum pricing to get started"
                features={[
                  "Comes with 12 seats",
                  "Signed BAA",
                  "AI-Powered Note Generation",
                  "Secure Data Storage",
                  "Intelligent Workspace Management",
                  "Language Agnostic Note-Taking",
                  "Dedicated Expert Support",
                ]}
              />
              <PricingCard
                title="Professional"
                price="$25/seat/month"
                description="For teams of 13+ seats"
                features={[
                  "Unlimited Seats",
                  "Signed BAA",
                  "AI-Powered Note Generation",
                  "Secure Data Storage",
                  "Intelligent Workspace Management",
                  "Language Agnostic Note-Taking",
                  "Dedicated Expert Support",
                  "Priority Support",
                ]}
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-sm:scroll-m-[50px] w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <div className="lg:text-center">
                <h2 className="text-base text-latte-text font-semibold tracking-wide uppercase">Contact Us</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">A Direct Line To Us</p>
                <p className="mt-4 max-w-2xl text-xl text-latte-subtext0 lg:mx-auto">
                  Have questions or ready to get started? We're here to help.
                </p>
              </div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <a target="_blank" rel="noopener noreferrer" href="mailto:support@notedfl.com">
                <Button variant="link" className="text-2xl italic text-primary mb-4">
                  support@notedfl.com
                </Button>
              </a>
              <p className="text-latte-text mb-8">Reach out to us for any inquiries or support needs.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-latte-mantle p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Get Started</h3>
                  <ul className="text-latte-text space-y-2">
                    <li>Learn about our services</li>
                    <li>Request a demo</li>
                    <li>Discuss pricing options</li>
                  </ul>
                </div>
                <div className="bg-latte-mantle p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Support</h3>
                  <ul className="text-latte-text space-y-2">
                    <li>Technical assistance</li>
                    <li>Account management</li>
                    <li>Billing inquiries</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-latte-mantle">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-latte-text">Start your journey today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`mailto:support@notedfl.com?subject=${mailtoSubjects.getStarted}`}
                className="inline-flex rounded-md shadow"
              >
                <Button size="lg">Get started</Button>
              </a>
              <Link href="/#features" className="ml-3 inline-flex rounded-md shadow">
                <Button variant="outline" size="lg">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 mx-auto">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose md:text-left text-latte-subtext0">
                © {new Date().getFullYear()} Noted. All rights reserved.
              </p>
            </div>
            <nav className="flex items-center space-x-4 text-sm font-medium text-latte-subtext0">
              <Link href="/terms-of-service">Terms</Link>
              <Link href="/privacy-policy">Privacy</Link>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  )
    ;
}

type FeatureCardProps = {
  title: string
  description: string
  Icon: LucideIcon
}

function FeatureCard({ title, description, Icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-latte-subtext1">{description}</p>
    </div>
  )
}

type PricingCardProps = {
  title: string
  price: string
  description: string
  features: string[]
}

function PricingCard({ title, price, description, features }: PricingCardProps) {
  return (
    <div className="flex flex-col p-6 bg-background rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold mb-4">{price}</p>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="w-5 h-5 text-latte-green mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`mailto:support@notedfl.com?subject=${mailtoSubjects.getStarted}`}
        className="mt-auto"
      >
        <Button className="w-full">Contact Us</Button>
      </a>
    </div>
  )
}

