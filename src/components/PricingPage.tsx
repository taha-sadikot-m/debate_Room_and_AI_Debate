
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Star, Zap } from 'lucide-react';

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
        '5 debates per month',
        'Basic AI opponent',
        'Standard feedback',
        '3 languages available',
        'Basic progress tracking'
      ],
      limitations: [
        'Limited debate topics',
        'No tournament access',
        'Basic AI responses'
      ]
    },
    {
      name: 'Pro',
      price: '20',
      period: 'per year',
      description: 'For serious debaters',
      icon: Zap,
      color: 'bg-blue-100 text-blue-600',
      popular: false,
      features: [
        'Unlimited debates',
        'Advanced AI opponent',
        'Detailed feedback & analytics',
        'All 17 Indian languages',
        'Advanced progress tracking',
        'Custom debate topics',
        'Voice analysis',
        'Export performance reports'
      ]
    },
    {
      name: 'Plus',
      price: '150',
      period: 'per year',
      description: 'For schools and institutions',
      icon: Crown,
      color: 'bg-indigo-100 text-indigo-600',
      popular: true,
      features: [
        'Everything in Pro',
        'Debate tournament access',
        'Multi-student management',
        'Teacher dashboard',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'Bulk student accounts',
        'Performance insights',
        'MUN simulation access'
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
                  className={`w-full mt-6 ${plan.popular ? 'gradient-indigo text-white' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === '0' ? 'Get Started Free' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Premium?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Unlimited Practice</h3>
            <p className="text-gray-600">Debate as much as you want without restrictions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tournament Access</h3>
            <p className="text-gray-600">Compete in exclusive debate tournaments</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Feedback</h3>
            <p className="text-gray-600">Get detailed insights to improve your skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
