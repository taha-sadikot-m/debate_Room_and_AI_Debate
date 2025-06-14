
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <img
          src="/lovable-uploads/80a86b55-ac06-4e1e-905b-e5574803f537.png"
          alt="MyDebate.ai Logo"
          className="h-16 w-16 mx-auto mb-4"
        />
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
