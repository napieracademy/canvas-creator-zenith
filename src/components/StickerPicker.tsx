
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Smile, SmilePlus, Laugh, Angry, Ghost } from "lucide-react";

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
  ];

  const stickers = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
      alt: "Orange and white tabby cat"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
      alt: "Grey tabby kitten"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
      alt: "Brown deer"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
      alt: "Cat sticker"
    }
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
            {stickers.map((sticker) => (
              <Button
                key={sticker.id}
                variant="outline"
                className="aspect-square hover:bg-gray-100 p-2"
                onClick={() => onStickerSelect(`sticker-${sticker.id}`)}
              >
                <img 
                  src={sticker.url} 
                  alt={sticker.alt}
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
