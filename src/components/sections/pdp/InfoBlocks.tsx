export default function InfoBlocks() {
  const infoItems = [
    { icon: "🚚", text: "Free shipping over $100" },
    { icon: "↩", text: "14-day returns" },
    { icon: "🔒", text: "Secure checkout" },
    { icon: "📦", text: "Ships within 2–4 days" },
  ];

  return (
    <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
      {infoItems.map((item, index) => (
        <div key={index}>
          {item.icon} {item.text}
        </div>
      ))}
    </div>
  );
}
