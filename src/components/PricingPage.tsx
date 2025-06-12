
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Star, Zap, Users, GraduationCap } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
}

const PricingPage = ({ onBack }: PricingPageProps) => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Star,
      color: 'bg-gray-100 text-gray-600',
      features: [
        'AI debates - unlimited',
        'Live debates with users (5 per month)',
        'Basic AI feedback',
        'Standard progress tracking',
        'Access to 10+ languages'
      ],
      limitations: [
        'Limited advanced features',
        'Basic AI responses',
        'No 1-on-1 sessions'
      ]
    },
    {
      name: 'Pro',
      price: '50',
      period: 'per year',
      description: 'For serious debaters',
      icon: Zap,
      color: 'bg-indigo-100 text-indigo-600',
      popular: false,
      indianPrice: '₹4,000',
      features: [
        'Everything in Free',
        'Unlimited live debates',
        'Advanced AI feedback & analytics',
        'Voice analysis & speech patterns',
        'Campus interview preparation',
        'Advanced progress tracking',
        'Custom debate topics',
        'Export performance reports',
        'Priority support'
      ]
    },
    {
      name: 'Plus',
      price: '100',
      period: 'per year',
      description: 'For institutions & professionals',
      icon: Crown,
      color: 'bg-indigo-100 text-indigo-600',
      popular: true,
      indianPrice: '₹8,000',
      features: [
        'Everything in Pro',
        '5 personal 1-on-1 training sessions',
        'Institution/Corporate features',
        'Full campus recruitment training',
        'Multi-student management',
        'Teacher/HR dashboard',
        'Bulk student accounts',
        'Custom branding',
        'Advanced analytics & insights',
        'MUN simulation access',
        'Dedicated account manager'
      ]
    }
  ];

  const trainingOptions = [
    {
      title: 'Campus Interview Training',
      description: 'Complete preparation for campus placements',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-600',
      features: [
        'Mock interview sessions',
        'Technical & HR rounds',
        'Group discussion practice',
        'Presentation skills',
        'Industry-specific scenarios'
      ]
    },
    {
      title: 'School Students Program',
      description: 'Age-appropriate debate and communication skills',
      icon: Users,
      color: 'bg-green-100 text-green-600',
      features: [
        'Basic debate fundamentals',
        'Public speaking confidence',
        'Critical thinking development',
        'Age-appropriate topics',
        'Progress tracking for teachers'
      ]
    },
    {
      title: 'College Students Advanced',
      description: 'Professional-level debate and communication',
      icon: Star,
      color: 'bg-purple-100 text-purple-600',
      features: [
        'Advanced argumentation techniques',
        'Research and fact-checking',
        'Professional presentation skills',
        'Industry case studies',
        'Career-focused training'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Unlock your debating potential with our premium features</p>
        </div>
        <Button variant="outline" onClick={onBack} className="absolute left-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan, index) => {
          const IconComponent = plan.icon;
          return (
            <Card 
              key={plan.name} 
              className={`card-shadow relative ${plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''} hover:shadow-xl transition-all`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                  {plan.indianPrice && (
                    <div className="text-lg text-indigo-600 mt-1">
                      {plan.indianPrice}/year
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  className={`w-full mt-6 ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === '0' ? 'Get Started Free' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Training Options */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Specialized Training Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainingOptions.map((training, index) => {
            const IconComponent = training.icon;
            return (
              <Card key={index} className="card-shadow hover:shadow-xl transition-all">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${training.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{training.title}</CardTitle>
                  <p className="text-gray-600 mt-2">{training.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {training.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Premium?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Unlimited Practice</h3>
            <p className="text-gray-600">Debate as much as you want without restrictions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personal Training</h3>
            <p className="text-gray-600">1-on-1 sessions with expert trainers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Campus Ready</h3>
            <p className="text-gray-600">Complete preparation for campus interviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
