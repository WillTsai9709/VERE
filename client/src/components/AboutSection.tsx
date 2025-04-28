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
                src="/images/profile_photo.jpeg" 
                alt="VERE artist portrait" 
                className="w-full h-auto rounded-full shadow-md aspect-square object-cover"
                style={{ objectPosition: '50% 30%' }} /* 向上调整视角：默认是50% 50%，改为50% 30%使视角上移 */
              />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="font-montserrat font-bold text-white text-sm">SINCE<br />2022</span>
              </div>
            </div>
          </div>
          
          {/* About Content */}
          <div className="md:w-3/5">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
              About VERE
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed chinese-text">
              VERE 是一位獨立流行樂團、製作、混音和表演藝術家，致力於創造融合溫暖和豐富質感的沉浸式音頻體驗。VERE 目前駐台北，自 2022 年以來，持續創作具有情感共鳴的音樂。
              如果您有興趣合作或只是想聊聊，歡迎隨時聯繫我們。
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              VERE is an indie pop music producer, mixing engineer, and performing artist for creating immersive audio experiences that blend warm and rich textures. Based in Taipei, VERE has been crafting emotionally resonant music since 2022.
              If you are interested in collaborating or just want to chat, feel free to contact us.
            </p>
            {/* Second paragraph removed as requested */}
            
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
