import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Brain,
  Shield,
  Users,
  Languages,
  FileText,
  Headphones,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Note Generation',
      description: 'Transform conversations into comprehensive, professional notes using cutting-edge AI technology.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Shield,
      title: 'HIPAA-Compliant Security',
      description: 'Your data is protected with state-of-the-art encryption and complies with healthcare industry standards.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Enhance coordination between nurses and patients with our intuitive interface and smart organizational tools.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Languages,
      title: 'Multi-Language Support',
      description: 'Break language barriers with support for multiple languages, ensuring clear communication with all patients.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: FileText,
      title: 'Smart Templates',
      description: 'Use pre-built templates for different care scenarios, goals, behaviors, and safety measures.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Headphones,
      title: '24/7 Expert Support',
      description: 'Our dedicated support team is always available to assist you with smooth operations and quick issue resolution.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  const benefits = [
    'Reduce documentation time by 60%',
    'Improve care quality and consistency',
    'Ensure regulatory compliance',
    'Enhance team communication'
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wide text-sm">Features</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            A Better Way to Manage Health Care Notes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide cutting-edge tools to streamline your workflow and enhance
            patient care documentation with intelligent automation.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Transform Your Healthcare Documentation
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Time Saved</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2.5 hours</div>
                <div className="text-gray-600">per day, per nurse</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;