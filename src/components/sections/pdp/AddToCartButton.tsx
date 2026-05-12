interface AddToCartButtonProps {
  onClick?: () => void;
}

export default function AddToCartButton({ onClick }: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-black text-white py-3 mt-4 hover:opacity-90 transition"
    >
      ADD TO CART
    </button>
  );
}
