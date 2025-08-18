import React from 'react';
import { Shield, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable records secured by blockchain technology ensure your land ownership is permanently protected and tamper-proof.',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Verify land ownership and transaction history instantly with cryptographic proof and transparent audit trails.',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access your land records from anywhere in the world with our secure, decentralized platform.',
    },
  ];

  const benefits = [
    'Eliminate fraud and disputes with immutable blockchain records',
    'Reduce transaction time from weeks to minutes',
    'Lower costs by removing intermediaries',
    'Ensure complete transparency in all transactions',
    'Enable secure peer-to-peer land transfers',
    'Maintain permanent, verifiable ownership history',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LR</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">LandRegistry</span>
            </div>
            <Button onClick={onGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Land Ownership
              <span className="text-blue-700 block">On The Blockchain</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionary blockchain-based peer-to-peer land ownership management system. 
              Register, verify, and transfer land ownership with complete security and transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onGetStarted}>
                Start Managing Land
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Blockchain Land Registry?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of land management with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Land Management Forever
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform leverages blockchain technology to create a secure, transparent, 
                and efficient land ownership management system that benefits all stakeholders.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of users who trust our platform for secure land management.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={onGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LR</span>
              </div>
              <span className="ml-2 text-xl font-bold">LandRegistry</span>
            </div>
            <p className="text-gray-400 mb-4">
              Securing land ownership through blockchain technology
            </p>
            <p className="text-sm text-gray-500">
              © 2024 LandRegistry. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}