import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mail, Briefcase, Music } from "lucide-react";

interface TourDate {
  id: string;
  date: string;
  venue: string;
  location: string;
  ticketLink: string;
}

const ConnectSection = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  
  const { data: tourDates } = useQuery<TourDate[]>({
    queryKey: ['/api/artist/tour-dates'],
  });
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!consent) {
      toast({
        title: "Error",
        description: "Please agree to receive emails.",
        variant: "destructive",
      });
      return;
    }
    
    // This would normally submit to a newsletter API
    toast({
      title: "Success!",
      description: "You've been added to our newsletter.",
    });
    
    // Reset form
    setEmail("");
    setConsent(false);
  };

  return (
    <section id="connect" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Information */}
          <div className="md:w-1/2">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
              Connect with VERE
            </h2>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Follow on social media, listen on streaming platforms, or reach out directly for bookings and inquiries.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                  <Mail className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Bookings & Inquiries</h4>
                  <a href="mailto:bookings@vere.com" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">bookings@vere.com</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                  <Briefcase className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Management</h4>
                  <p className="text-gray-400">Sonic Agency Berlin</p>
                  <a href="mailto:management@vere.com" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">management@vere.com</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                  <Music className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Record Label</h4>
                  <p className="text-gray-400">Nebula Sounds International</p>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <h3 className="font-montserrat font-semibold text-xl text-white mb-4">Follow</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://open.spotify.com/artist/4EXkqFOhrs5mcfZwFgiEOF?si=zDIQP4o4T0yXjFIs2jrsSw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1DB954] hover:bg-[#1AA64B] flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="Spotify"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/thisisvere?igsh=MWRya3F3YXV1ZWdzaw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 flex items-center justify-center rounded-full transition-opacity duration-300"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@vere9809?si=1KOkzlhCcFVbWZZD" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#FF0000] hover:bg-[#CC0000] flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1DA1F2] hover:bg-[#1A91DA] flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://soundcloud.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#FF5500] hover:bg-[#E64D00] flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="SoundCloud"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.1.094L0 14.479l.175 1.308c.012.057.045.093.1.093.057 0 .091-.036.1-.093l.203-1.308-.203-1.332c-.01-.057-.045-.094-.1-.094m1.83-1.09c-.057 0-.09.051-.09.11l-.214 2.336.214 2.254c0 .058.033.106.09.106.056 0 .092-.048.092-.106l.24-2.254-.24-2.336c0-.058-.037-.11-.09-.11m.863-.474c-.057 0-.09.05-.09.11l-.203 2.81.205 2.697c0 .059.037.11.095.11.052 0 .092-.051.092-.11l.227-2.697-.227-2.81c0-.059-.037-.11-.09-.11m.902-.257c-.056 0-.09.05-.09.108l-.195 3.168.196 3.045c0 .06.037.11.09.11.055 0 .095-.05.095-.11l.22-3.046-.22-3.167c0-.05-.037-.11-.09-.11m.93-.054c-.056 0-.095.052-.095.11l-.19 3.33.17 3.494c.01.068.05.118.11.118.056 0 .093-.05.093-.12l.22-3.494-.22-3.33c0-.057-.037-.11-.09-.11m.912.333c-.068 0-.11.05-.11.12l-.18 2.91.18 3.71c0 .07.042.12.11.12.07 0 .12-.05.12-.12l.2-3.71-.2-2.91c-.01-.069-.06-.12-.12-.12m.99-.152c-.068 0-.12.06-.12.12l-.17 3.06.17 3.8c0 .07.053.13.122.13.075 0 .121-.06.121-.14l.19-3.79-.19-3.06c0-.06-.045-.12-.12-.12m1.813-1.835c-.087 0-.142.063-.142.14l-.142 4.897.142 3.27c0 .072.055.14.142.14.082 0 .14-.068.14-.14l.156-3.27-.156-4.897c0-.077-.047-.14-.14-.14m.894.098c-.083 0-.144.069-.144.14l-.133 4.787.133 3.117c0 .071.061.14.144.14.085 0 .145-.069.145-.14l.152-3.116-.152-4.787c0-.071-.06-.14-.145-.14m.924.061c-.1 0-.158.07-.158.154l-.125 4.715.125 3.012c.012.086.07.156.158.156.09 0 .156-.07.156-.156l.14-3.012-.14-4.715c0-.087-.07-.154-.156-.154m2.04-.914c-.12 0-.203.09-.203.194l-.105 5.485.105 2.941c0 .102.084.194.203.194.115 0 .2-.092.2-.194l.117-2.941-.117-5.485c0-.104-.085-.194-.2-.194m1.427-.186c-.133 0-.23.096-.23.23l-.094 5.44.094 2.884c0 .132.097.23.23.23.135 0 .236-.098.236-.23l.105-2.884-.105-5.439c0-.134-.1-.23-.236-.23m2.962 6.887c0-1.647-1.33-2.985-2.97-2.985-.595 0-1.152.19-1.608.478-.12.162-.19.582-.19 1.08v8.662c0 .504.18.836.452.898.302.068.732.108 1.35.108 1.64 0 2.967-1.334 2.967-2.98v-5.26"/>
                </svg>
              </a>
              <a 
                href="https://twitch.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#9146FF] hover:bg-[#7F3FE0] flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="Twitch"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Tour Dates & Newsletter */}
          <div className="md:w-1/2">
            <Card className="bg-zinc-800 rounded-xl p-6 mb-8">
              <CardContent className="p-0">
                <h3 className="font-montserrat font-semibold text-xl text-white mb-6">Upcoming Tour Dates</h3>
                
                <div className="space-y-6">
                  {tourDates ? (
                    tourDates.map((date) => (
                      <div key={date.id} className="flex items-center justify-between border-b border-zinc-700 pb-4">
                        <div>
                          <div className="text-purple-400 font-medium">
                            {new Date(date.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                          </div>
                          <div className="text-white font-medium">{date.venue}</div>
                          <div className="text-gray-400 text-sm">{date.location}</div>
                        </div>
                        <a 
                          href={date.ticketLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white text-sm rounded-full transition-colors duration-300"
                        >
                          Tickets
                        </a>
                      </div>
                    ))
                  ) : (
                    // Fallback for loading state
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-zinc-700 pb-4">
                        <div>
                          <div className="h-5 w-24 bg-zinc-700 rounded mb-2"></div>
                          <div className="h-5 w-32 bg-zinc-700 rounded mb-2"></div>
                          <div className="h-4 w-28 bg-zinc-700 rounded"></div>
                        </div>
                        <div className="px-4 py-2 bg-zinc-700 text-transparent rounded-full">Tickets</div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <a href="#" className="inline-block text-purple-400 hover:text-purple-300 transition-colors duration-300">
                    View all tour dates <span aria-hidden="true">→</span>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            {/* Newsletter */}
            <Card className="bg-zinc-800 rounded-xl p-6">
              <CardContent className="p-0">
                <h3 className="font-montserrat font-semibold text-xl text-white mb-4">Join the Newsletter</h3>
                <p className="text-gray-400 mb-6">
                  Sign up to receive updates on new releases, tour dates, and exclusive content.
                </p>
                
                <form onSubmit={handleSubscribe}>
                  <div className="mb-4">
                    <Label htmlFor="email" className="block text-gray-400 mb-2 text-sm">Email Address</Label>
                    <Input 
                      type="email" 
                      id="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-700 focus:border-purple-500 text-white focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-start mb-6">
                    <Checkbox 
                      id="consent" 
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(checked as boolean)}
                      className="mt-1 mr-2"
                    />
                    <Label htmlFor="consent" className="text-gray-400 text-sm">
                      I agree to receive emails about VERE music, merchandise, and events. You can unsubscribe at any time.
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full py-3 bg-purple-800 hover:bg-purple-900 text-white font-medium rounded-lg transition-colors duration-300">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
