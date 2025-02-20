
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Smile, SmilePlus, Laugh, Angry, Ghost, Alien } from "lucide-react";

interface StickerPickerProps {
  onStickerSelect: (sticker: string) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect }) => {
  const emojis = [
    { icon: <Smile className="w-6 h-6" />, name: "smile" },
    { icon: <SmilePlus className="w-6 h-6" />, name: "smile-plus" },
    { icon: <Laugh className="w-6 h-6" />, name: "laugh" },
    { icon: <Angry className="w-6 h-6" />, name: "angry" },
    { icon: <Ghost className="w-6 h-6" />, name: "ghost" },
    { icon: <Alien className="w-6 h-6" />, name: "alien" },
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="emoji" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emoji" className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {emojis.map((emoji) => (
              <Button
                key={emoji.name}
                variant="outline"
                className="p-4 hover:bg-gray-100"
                onClick={() => onStickerSelect(emoji.name)}
              >
                {emoji.icon}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stickers" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((id) => (
              <Button
                key={id}
                variant="outline"
                className="aspect-square hover:bg-gray-100"
                onClick={() => onStickerSelect(`sticker-${id}`)}
              >
                <img 
                  src={`photo-${id}`} 
                  alt={`Sticker ${id}`}
                  className="w-full h-full object-cover rounded"
                />
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StickerPicker;
