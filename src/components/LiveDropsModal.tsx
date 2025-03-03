
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplets, Crown, Trophy, ArrowDown, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getRewardTierClass } from "@/utils/rewardUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Drop {
  id: string;
  username: string;
  itemName: string;
  value: number;
  level: number;
  timestamp: string;
}

interface LiveDropsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LiveDropsModal = ({ isOpen, onOpenChange }: LiveDropsModalProps) => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fallback data in case Supabase fetch fails
  const mockDrops: Drop[] = [
    {
      id: "1",
      username: "LuckyGamer123",
      itemName: "Dragon Lore",
      value: 75000,
      level: 95,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      username: "WinnerToday",
      itemName: "Gold Medallion",
      value: 65000,
      level: 78,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      username: "ProUnboxer",
      itemName: "Royal Crown",
      value: 45000,
      level: 62,
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    },
    {
      id: "4",
      username: "CaseMaster",
      itemName: "Silver Shield",
      value: 25000,
      level: 41,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: "5",
      username: "NewPlayer001",
      itemName: "Bronze Sword",
      value: 8000,
      level: 22,
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  ];

  const fetchRecentDrops = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('case_openings')
        .select(`
          id, 
          created_at,
          value_won,
          profiles:user_id (username),
          items:item_won (name),
          user_progress!inner(current_level)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedDrops = data.map(drop => ({
          id: drop.id,
          username: drop.profiles?.username || 'Anonymous',
          itemName: drop.items?.name || 'Mystery Item',
          value: drop.value_won || 0,
          level: drop.user_progress?.current_level || 1,
          timestamp: drop.created_at
        }));
        
        setDrops(formattedDrops);
      } else {
        // Use mock data if no real data is available
        setDrops(mockDrops);
      }
    } catch (error) {
      console.error("Error fetching drops:", error);
      // Use mock data as fallback
      setDrops(mockDrops);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecentDrops();
      
      // Set up real-time subscription
      const channel = supabase.channel('case-opening-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'case_openings',
          },
          async (payload: RealtimePostgresChangesPayload<any>) => {
            console.log('New case opening:', payload);
            // Fetch the complete data for the new opening
            const { data, error } = await supabase
              .from('case_openings')
              .select(`
                id, 
                created_at,
                value_won,
                profiles:user_id (username),
                items:item_won (name),
                user_progress!inner(current_level)
              `)
              .eq('id', payload.new.id)
              .single();
            
            if (!error && data) {
              const newDrop: Drop = {
                id: data.id,
                username: data.profiles?.username || 'Anonymous',
                itemName: data.items?.name || 'Mystery Item',
                value: data.value_won || 0,
                level: data.user_progress?.current_level || 1,
                timestamp: data.created_at
              };
              
              setDrops(prevDrops => [newDrop, ...prevDrops.slice(0, 19)]);
            }
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecentDrops();
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-black/90 border-accent/50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <Droplets className="h-6 w-6 text-teal-500" />
            Live Drops
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 border-teal-500/50 text-teal-500 hover:bg-teal-500/10"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading recent drops...</div>
            </div>
          ) : drops.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No drops found.
            </div>
          ) : (
            <div className="space-y-3">
              {drops.map((drop) => (
                <div 
                  key={drop.id}
                  className="bg-black/30 border border-accent/20 rounded-lg p-4 transition-all hover:bg-accent/5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full p-1 ${getRewardTierClass(drop.level)}`}>
                        {drop.level >= 90 ? (
                          <Crown className="h-5 w-5" />
                        ) : drop.level >= 50 ? (
                          <Trophy className="h-5 w-5" />
                        ) : (
                          <ArrowDown className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{drop.username}</p>
                        <p className="text-xs text-muted-foreground">Level {drop.level}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className={getRewardTierClass(drop.level)}>
                        ${drop.value.toLocaleString()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(drop.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <p>Won <span className={`font-semibold ${getRewardTierClass(drop.level)}`}>{drop.itemName}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
