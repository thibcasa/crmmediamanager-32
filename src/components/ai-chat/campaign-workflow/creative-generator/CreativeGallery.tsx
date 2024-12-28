import { CampaignData } from '../../types/campaign';

interface CreativeGalleryProps {
  creatives: CampaignData['creatives'];
}

export const CreativeGallery = ({ creatives }: CreativeGalleryProps) => {
  if (creatives.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {creatives.map((creative, index) => (
        <div key={index} className="relative aspect-square">
          <img
            src={creative.url}
            alt={`Créative ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};