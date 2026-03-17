import Link from "next/link";

export default function GateView({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center bg-white border border-[#F0EBE1] rounded-[2.5rem] shadow-sm p-10">
        <h1 className="text-4xl font-serif mb-4">{title}</h1>
        <p className="text-[#6B655E] font-light leading-relaxed mb-8">
          {description}
        </p>
        <Link
          href={href}
          className="bg-[#3A3836] text-white px-8 py-4 rounded-full hover:bg-[#2C2A28] transition-colors inline-flex"
        >
          {cta}
        </Link>
      </div>
    </main>
  );
}