
import React from 'react';
import AuthenticatedApp from '@/components/AuthenticatedApp';

const Index = () => {
  // For testing purposes, bypass authentication and go directly to dashboard
  return <AuthenticatedApp />;
};

export default Index;