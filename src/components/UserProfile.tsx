import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{user.name}</CardTitle>
        <CardDescription>
          {user.verified_email && (
            <Badge variant="secondary" className="mb-2">
              <Mail className="h-3 w-3 mr-1" />
              Verified Email
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Name:</span>
            <span className="font-medium">{user.firstName} {user.lastName}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          
          {user.locale && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Locale:</span>
              <span className="font-medium">{user.locale}</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
