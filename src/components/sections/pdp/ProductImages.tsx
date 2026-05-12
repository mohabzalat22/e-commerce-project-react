type GalleryImage = { url: string; alt: string };

type ProductImagesProps = {
  images: GalleryImage[];
};

export default function ProductImages({ images }: ProductImagesProps) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 text-sm text-gray-500">
        No images available
      </div>
    );
  }

  const main = images[0];
  const second = images[1];
  const third = images[2] ?? images[0];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-3">
        <img
          src={main.url}
          className="h-[520px] w-full object-cover"
          alt={main.alt}
        />
        {second ? (
          <img
            src={second.url}
            className="h-[260px] w-full object-cover"
            alt={second.alt}
          />
        ) : null}
      </div>

      <div>
        <img
          src={third.url}
          className="h-[800px] w-full object-cover"
          alt={third.alt}
        />
      </div>
    </div>
  );
}
