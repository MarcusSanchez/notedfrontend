import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 mb-6 animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Trusted by 10,000+ healthcare professionals
            </Badge>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Revolutionize Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Home Health Care
            </span>{' '}
            Documentation
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Empower your nurses with AI-assisted note-taking. Simplify documentation,
            improve care quality, and save valuable time with intelligent automation.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 animate-fade-in">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold group">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold group">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500 animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.pexels.com/photos/6303773/pexels-photo-6303773.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <span>Join 10,000+ users</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;