export default function LoadingState({
    label = "Loading...",
  }: {
    label?: string;
  }) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center px-6 text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#EAE6DF]" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#D4B59E] animate-spin" />
        </div>
        <p className="text-[#8C7A6B] font-light">{label}</p>
      </main>
    );
  }