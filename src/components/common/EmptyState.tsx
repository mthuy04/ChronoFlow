import { Feather } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-[#EAE6DF] rounded-[2.5rem] bg-white/60 px-6">
      <Feather className="w-10 h-10 mb-5 text-[#D4B59E]/50" />
      <h2 className="text-3xl font-serif mb-3">{title}</h2>
      <p className="text-[#8C7A6B] font-light max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}