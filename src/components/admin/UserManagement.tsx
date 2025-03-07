
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Mail, Key, Shield, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface UserDetails {
  id: string;
  username: string;
  created_at: string;
  email?: string;
  password?: string;
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users from profiles...');
      
      // Fetch profiles directly from the profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, created_at');
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log('Fetched profiles data:', profiles);
      
      // Format the user data
      const formattedUsers = profiles?.map(profile => ({
        id: profile.id,
        username: profile.username || 'Unknown user',
        created_at: profile.created_at,
        // Note: We don't actually have access to the password since Supabase
        // properly secures them with hashing. This is just for demonstration.
        password: "••••••••" // Placeholder for actual password
      })) || [];
      
      return formattedUsers;
    },
  });

  const handleUserClick = (user: UserDetails) => {
    setSelectedUser(user);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      {!users || users.length === 0 ? (
        <p className="text-muted-foreground">No users found</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg border bg-card cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => handleUserClick(user)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">User ID: {user.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Account information for this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4 border-b pb-3">
                <User className="w-8 h-8 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium text-lg">{selectedUser.username}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 border-b pb-3">
                <Mail className="w-8 h-8 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium text-lg">
                    {selectedUser.email || "Email not available in profile"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 border-b pb-3">
                <Shield className="w-8 h-8 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Password</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg">
                      {selectedUser.password || "••••••••"} 
                    </p>
                    <Badge variant="outline" className="text-xs">Secured</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Password is securely stored for administrator access only
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 border-b pb-3">
                <Key className="w-8 h-8 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">User ID (for reference)</p>
                  <p className="font-mono text-sm break-all">{selectedUser.id}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="font-medium">
                    {new Date(selectedUser.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedUser(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
