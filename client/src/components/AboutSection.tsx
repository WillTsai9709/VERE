import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const AboutSection = () => {
  const { data: artistInfo } = useQuery({
    queryKey: ['/api/artist/info'],
  });

  return (
    <section id="about" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Artist Image */}
          <div className="md:w-2/5">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1542&q=80" 
                alt="VERE artist portrait" 
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="font-montserrat font-bold text-white text-sm">SINCE<br />2022</span>
              </div>
            </div>
          </div>
          
          {/* About Content */}
          <div className="md:w-3/5">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
              About VERE
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              VERE is the electronic music project of Alex Vega, a producer and performer known for creating immersive audio experiences that blend atmospheric soundscapes with driving beats. Based in Berlin, VERE has been pushing the boundaries of electronic music since 2022.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              With influences ranging from ambient and techno to experimental electronic and cinematic scores, VERE creates music that takes listeners on a journey through sound and emotion. The project has performed at clubs and festivals across Europe and released music on several respected electronic labels.
            </p>
            
            {/* Stats - Hidden per request */}
            
            {/* Music Genres */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="px-4 py-2 bg-purple-900 text-white text-sm rounded-full">indie pop</Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-purple-900 text-white text-sm rounded-full">alternative</Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-purple-900 text-white text-sm rounded-full">pop</Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-purple-900 text-white text-sm rounded-full">indie rock</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
