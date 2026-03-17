import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { KIT_DATA } from "@/data/kit";

export default function KitPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Navbar variant="guest" />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-[#F8F7F3] rounded-[4rem] border border-[#EAE6DF] flex flex-col items-center justify-center relative p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

            <div className="w-64 h-80 bg-[#FDFCF8] shadow-2xl rounded-sm rotate-3 border border-stone-200 flex flex-col p-8 relative z-10">
              <div className="w-full text-center border-b border-stone-200 pb-4 mb-4 font-serif text-stone-300 tracking-widest text-[10px]">
                CHRONOFLOW
              </div>
              <div className="w-16 h-1 bg-[#D4B59E] mb-8" />
              <div className="flex-1 border-b border-stone-100 mb-6" />
              <div className="flex-1 border-b border-stone-100 mb-6" />
            </div>

            <div className="absolute bottom-10 text-[10px] tracking-[0.3em] text-[#A39C93] uppercase font-bold">
              FSC® Certified Paper
            </div>
          </div>

          <div>
            <div className="inline-block px-3 py-1 bg-[#E8F0EA] text-[#059669] text-[10px] font-bold uppercase tracking-widest rounded-full mb-8">
              {KIT_DATA.badge}
            </div>

            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-8">
              {KIT_DATA.name.split(" ").slice(0, 2).join(" ")}
              <br />
              {KIT_DATA.name.split(" ").slice(2).join(" ")}
            </h1>

            <p className="text-[#6B655E] text-lg font-light leading-relaxed mb-10">
              {KIT_DATA.shortDescription}
            </p>

            <ul className="space-y-5 border-t border-b border-[#F0EBE1] py-8 mb-10">
              {KIT_DATA.features.map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-center gap-4 text-[#3A3836] font-light"
                >
                  <Check className="w-5 h-5 text-[#D4B59E]" />
                  {feature.label}
                </li>
              ))}
            </ul>

            <div className="text-5xl font-light mb-8">{KIT_DATA.price}</div>

            <button className="w-full bg-[#3A3836] text-white rounded-full py-5 text-lg font-light hover:bg-[#2C2A28] transition-colors flex items-center justify-center gap-3 mb-5">
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>

            <p className="text-center text-xs uppercase tracking-widest text-[#8C7A6B] font-light">
              {KIT_DATA.shippingNote}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-24 bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-10">
          <h2 className="text-3xl font-serif mb-5">How it works with the app</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {KIT_DATA.usageFlow.map((item) => (
              <FlowCard
                key={item.step}
                step={item.step}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/assessment"
              className="inline-flex bg-[#3A3836] text-white px-8 py-4 rounded-full text-lg font-light hover:bg-[#2C2A28] transition-colors"
            >
              Start with the quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FlowCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] bg-[#F8F7F3] p-6">
      <div className="text-3xl font-serif text-[#D4B59E]/50 mb-3">{step}</div>
      <h3 className="text-xl font-serif mb-2">{title}</h3>
      <p className="text-[#6B655E] font-light leading-relaxed">
        {description}
      </p>
    </div>
  );
}