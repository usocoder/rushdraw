
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { PlusCircle, Bot, Clock, Trash2, Edit, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface BotData {
  id: string;
  name: string;
  description: string;
  platform: string;
  active: boolean;
  delay: number;
  createdAt: Date;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bots, setBots] = useState<BotData[]>([]);
  const [showNewBot, setShowNewBot] = useState(false);
  const [activeTab, setActiveTab] = useState("bots");
  
  // New bot form
  const [newBotName, setNewBotName] = useState("");
  const [newBotDescription, setNewBotDescription] = useState("");
  const [newBotPlatform, setNewBotPlatform] = useState("whatsapp");
  const [newBotDelay, setNewBotDelay] = useState(5);

  // Create a new bot
  const handleCreateBot = () => {
    if (!newBotName || !newBotDescription) {
      toast({
        title: "Missing information",
        description: "Please provide a name and description for your bot",
        variant: "destructive"
      });
      return;
    }

    const newBot: BotData = {
      id: Math.random().toString(36).substring(2, 9),
      name: newBotName,
      description: newBotDescription,
      platform: newBotPlatform,
      active: true,
      delay: newBotDelay,
      createdAt: new Date()
    };

    setBots([...bots, newBot]);
    setShowNewBot(false);
    setNewBotName("");
    setNewBotDescription("");
    setNewBotPlatform("whatsapp");
    setNewBotDelay(5);

    toast({
      title: "Bot created",
      description: `${newBotName} has been created successfully!`
    });
  };

  // Delete a bot
  const handleDeleteBot = (id: string) => {
    const updatedBots = bots.filter(bot => bot.id !== id);
    setBots(updatedBots);
    
    toast({
      title: "Bot deleted",
      description: "The bot has been removed successfully"
    });
  };

  // Toggle bot active status
  const toggleBotActive = (id: string) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === id) {
        return { ...bot, active: !bot.active };
      }
      return bot;
    });
    
    setBots(updatedBots);
    
    const bot = updatedBots.find(b => b.id === id);
    toast({
      title: bot?.active ? "Bot activated" : "Bot deactivated",
      description: `${bot?.name} is now ${bot?.active ? "active" : "inactive"}`
    });
  };

  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "email":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "sms":
        return <MessageSquare className="h-5 w-5 text-yellow-500" />;
      case "facebook":
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-400">Manage your AI bots and integrations</p>
        </div>
        <Button 
          onClick={() => setShowNewBot(!showNewBot)}
          className="mt-4 md:mt-0"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Bot
        </Button>
      </div>

      <Tabs defaultValue="bots" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bots" className="mt-6">
          {showNewBot && (
            <Card className="mb-8 border border-blue-500/30 shadow-lg shadow-blue-500/5">
              <CardHeader>
                <CardTitle>Create New Bot</CardTitle>
                <CardDescription>
                  Configure your new AI bot settings and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="botName">Bot Name</Label>
                  <Input 
                    id="botName"
                    placeholder="Enter bot name" 
                    value={newBotName} 
                    onChange={(e) => setNewBotName(e.target.value)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="botDescription">Description</Label>
                  <Textarea 
                    id="botDescription"
                    placeholder="Describe what this bot does" 
                    value={newBotDescription} 
                    onChange={(e) => setNewBotDescription(e.target.value)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="botPlatform">Platform</Label>
                  <Select 
                    value={newBotPlatform} 
                    onValueChange={setNewBotPlatform}
                  >
                    <SelectTrigger id="botPlatform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="facebook">Facebook Messenger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="botDelay">
                    Response Delay (minutes)
                  </Label>
                  <Input 
                    id="botDelay"
                    type="number" 
                    min={1} 
                    max={120} 
                    value={newBotDelay} 
                    onChange={(e) => setNewBotDelay(parseInt(e.target.value))} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewBot(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBot}>
                  Create Bot
                </Button>
              </CardFooter>
            </Card>
          )}

          {bots.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-lg border border-slate-700/50">
              <Bot className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">No bots created yet</h3>
              <p className="text-slate-400 mb-6">
                Create your first AI bot to start automating conversations
              </p>
              <Button onClick={() => setShowNewBot(true)}>
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Bot
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots.map((bot) => (
                <Card key={bot.id} className={`border ${bot.active ? 'border-blue-500/30' : 'border-slate-700/50'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Bot className={`h-5 w-5 mr-2 ${bot.active ? 'text-blue-500' : 'text-slate-500'}`} />
                        <CardTitle>{bot.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Label htmlFor={`active-${bot.id}`} className="sr-only">
                          Toggle active
                        </Label>
                        <Switch 
                          id={`active-${bot.id}`}
                          checked={bot.active} 
                          onCheckedChange={() => toggleBotActive(bot.id)} 
                        />
                      </div>
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      {getPlatformIcon(bot.platform)}
                      <span className="ml-1 capitalize">
                        {bot.platform}
                      </span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="ml-1">{bot.delay} min delay</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400">
                      {bot.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteBot(bot.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>OpenAI Integration</CardTitle>
                <CardDescription>Connect to OpenAI's API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="openai-key">API Key</Label>
                    <Input id="openai-key" type="password" placeholder="Enter OpenAI API key" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="openai-active" />
                    <Label htmlFor="openai-active">Active</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Go High Level</CardTitle>
                <CardDescription>Connect to Go High Level CRM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ghl-key">API Key</Label>
                    <Input id="ghl-key" type="password" placeholder="Enter GHL API key" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="ghl-active" />
                    <Label htmlFor="ghl-active">Active</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business</CardTitle>
                <CardDescription>Connect to WhatsApp Business API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp-key">API Key</Label>
                    <Input id="whatsapp-key" type="password" placeholder="Enter WhatsApp API key" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="whatsapp-active" />
                    <Label htmlFor="whatsapp-active">Active</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account and subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user?.username || ''} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled />
              </div>
              <div>
                <Label htmlFor="plan">Current Plan</Label>
                <Input id="plan" value="Starter Plan ($199)" disabled />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="font-medium">Bots Created</h4>
                  <p className="text-slate-400">3 of 3 bots used</p>
                </div>
                <Button>Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
