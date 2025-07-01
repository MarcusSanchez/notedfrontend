import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individual practitioners',
      badge: null,
      features: [
        'Up to 12 users',
        'Signed BAA',
        'AI-Powered Note Generation',
        'Secure Data Storage',
        'Intelligent Workspace Management',
        'Language Agnostic Note-Taking',
        'Dedicated Expert Support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/seat/month',
      description: 'Ideal for growing healthcare teams',
      badge: 'Most Popular',
      features: [
        'Unlimited team members',
        'Signed BAA',
        'AI-Powered Note Generation',
        'Secure Data Storage',
        'Intelligent Workspace Management',
        'Language Agnostic Note-Taking',
        'Dedicated Expert Support',
        'Priority Support',
        'Advanced Analytics',
        'Custom Templates',
        'API Access'
      ],
      cta: 'Start Free Trial',
      popular: true
    }
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wide text-sm">Pricing</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your team. All plans include our core features
            with no hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-gray-200 shadow-lg'} transition-all duration-300 hover:shadow-xl`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1 bg-primary text-white">
                    <Star className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>HIPAA compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;