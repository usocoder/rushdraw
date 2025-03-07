
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Mail, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserDetails {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users...');
      
      // Fetch auth users with their email
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw authError;
      }

      if (!authUsers) {
        return [];
      }

      // Fetch profiles to get usernames
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username');

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }

      // Combine the data
      const combinedUsers = authUsers.users.map(user => {
        const profile = profiles?.find(p => p.id === user.id);
        return {
          id: user.id,
          email: user.email || 'No email',
          username: profile?.username || user.email || 'Unknown user',
          created_at: user.created_at
        };
      });

      console.log('Combined users data:', combinedUsers);
      return combinedUsers;
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
                    <p className="text-sm text-muted-foreground">{user.email}</p>
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
                  <p className="font-medium text-lg">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Key className="w-8 h-8 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">User ID (for reference)</p>
                  <p className="font-mono text-sm break-all">{selectedUser.id}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4">
                Account created: {new Date(selectedUser.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
