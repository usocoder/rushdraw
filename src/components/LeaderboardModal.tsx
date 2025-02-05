import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  total_value: number;
  total_openings: number;
}

interface CaseOpeningResponse {
  user_id: string;
  value_won: number;
  profiles: {
    username: string | null;
  } | null;
}

export const LeaderboardModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('leaderboard_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'case_openings' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    fetchLeaderboard();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('case_openings')
      .select(`
        user_id,
        value_won,
        profiles!case_openings_user_id_fkey (username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return;
    }

    const leaderboardMap = new Map<string, LeaderboardEntry>();

    (data as CaseOpeningResponse[]).forEach((entry) => {
      const username = entry.profiles?.username || 'Unknown';
      const current = leaderboardMap.get(username) || {
        username,
        total_value: 0,
        total_openings: 0,
      };

      leaderboardMap.set(username, {
        ...current,
        total_value: current.total_value + Number(entry.value_won),
        total_openings: current.total_openings + 1,
      });
    });

    const sortedLeaderboard = Array.from(leaderboardMap.values())
      .sort((a, b) => b.total_value - a.total_value)
      .slice(0, 10);

    setLeaderboard(sortedLeaderboard);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Weekly Leaderboard
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.username}
              className="flex items-center justify-between p-4 bg-card rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                <div>
                  <p className="font-semibold">{entry.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.total_openings} cases opened
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-500">${entry.total_value.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};