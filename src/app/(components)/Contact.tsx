import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, Users, ArrowRight } from 'lucide-react';

const Contact = () => {
  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Get Started',
      description: 'Learn about our services and start your free trial',
      items: ['Request a demo', 'Discuss pricing options'],
      cta: 'Contact Sales',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      title: 'Support',
      description: 'Technical assistance and account management',
      items: ['Account management', 'Billing inquiries'],
      cta: 'Get Support',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wide text-sm">Contact Us</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            A Direct Line To Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or ready to get started? We're here to help you transform
            your healthcare documentation process.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {contactOptions.map((option, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className={`w-6 h-6 ${option.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {option.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {option.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full group">
                  {option.cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Direct contact */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to Transform Your Documentation?
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust Noted to streamline
            their workflow and improve patient care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
              Start Free Trial
            </Button>
            <div className="flex items-center space-x-2 text-white/80">
              <Mail className="w-5 h-5" />
              <span>support@Noted.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;