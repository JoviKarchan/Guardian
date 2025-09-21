import { HelpCircle, Phone, Mail, MessageSquare, ExternalLink, Book, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function SupportPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const emergencyContacts = [
    { 
      name: "Problem Gambling Helpline", 
      number: "1-800-522-4700", 
      available: "24/7",
    },
    { 
      name: "Crisis Text Line", 
      number: "Text HOME to 741741", 
      available: "24/7",
    },
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      status: "Available",
      contact: "chat@guardian.com",
    },
    {
      icon: Mail,
      title: "Email Support",
      status: "4hr response",
      contact: "support@guardian.com",
    },
  ];

  const resources = [
    { title: "Recovery Toolkit", type: "PDF Guide" },
    { title: "Prevention Plan", type: "Interactive" },
    { title: "Financial Guide", type: "PDF Guide" },
  ];

  const handleContactSelect = (contact: string) => {
    setSelectedContact(contact);
    console.log(`Initiating contact: ${contact}`);
  };

  return (
    <div className="w-full max-w-[310px] space-y-3">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Support Center</h2>
        <p className="text-xs text-muted-foreground">
          Professional help available 24/7
        </p>
      </div>

      <Card className="p-3 bg-destructive/10 border-destructive/20">
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-destructive mt-0.5" />
          <div>
            <h3 className="font-medium text-destructive text-sm">Crisis Support</h3>
            <p className="text-xs text-muted-foreground mb-2">
              In crisis? Reach out immediately
            </p>
            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.available}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-xs px-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => handleContactSelect(contact.number)}
                  >
                    <Phone className="w-2 h-2 mr-1" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <h3 className="font-medium text-sm">Professional Support</h3>
        {supportOptions.map((option, index) => (
          <Card key={index} className="p-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-secondary rounded-lg">
                <option.icon className="w-3 h-3 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="font-medium text-xs">{option.title}</p>
                  <Badge variant="secondary" className="text-xs h-3 px-1">
                    {option.status}
                  </Badge>
                </div>
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{option.contact}</code>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleContactSelect(option.contact)}
                className="h-5 text-xs px-2"
              >
                <ExternalLink className="w-2 h-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm">Resources</h3>
        {resources.map((resource, index) => (
          <Card key={index} className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-xs">{resource.title}</p>
                <Badge variant="secondary" className="text-xs h-3 px-1">{resource.type}</Badge>
              </div>
              <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                <Book className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-2 bg-muted/50">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-primary mt-0.5" />
          <div>
            <p className="text-xs font-medium">You're Not Alone</p>
            <p className="text-xs text-muted-foreground">
              Recovery is possible with proper support.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}