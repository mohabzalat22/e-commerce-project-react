type ProductDescriptionProps = {
  description: string;
  careText?: string;
};

export default function ProductDescription({
  description,
  careText,
}: ProductDescriptionProps) {
  if (!description && !careText) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      {description ? (
        <>
          <h3 className="mb-2 font-medium">Description</h3>
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
        </>
      ) : null}
      {careText ? (
        <div className="mt-4">
          <h3 className="mb-2 font-medium">Care</h3>
          <p className="text-sm leading-relaxed text-gray-600">{careText}</p>
        </div>
      ) : null}
    </div>
  );
}
