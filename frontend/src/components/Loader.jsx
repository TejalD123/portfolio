export default function Loader({ full = false }) {
  return (
    <div
      className={`flex items-center justify-center ${full ? "min-h-screen" : "py-16"}`}
    >
      <div className="w-9 h-9 rounded-full border-2 border-rose/25 border-t-rose animate-spin" />
    </div>
  );
}
