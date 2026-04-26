"use client";

export default function FocusScoreCard({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "text-emerald-600"
      : score >= 60
      ? "text-amber-600"
      : "text-rose-600";

  const bg =
    score >= 80
      ? "from-emerald-50 to-emerald-100"
      : score >= 60
      ? "from-amber-50 to-amber-100"
      : "from-rose-50 to-rose-100";

  return (
    <section className={`rounded-[30px] border border-white bg-gradient-to-br ${bg} p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]`}>
      <div className="text-[12px] font-bold uppercase tracking-wide text-[#8A84A3]">
        Focus score hôm nay
      </div>
      <div className={`mt-2 text-[42px] font-[950] leading-none ${tone}`}>
        {score}
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[#615C7A]">
        Điểm này phản ánh mức độ hợp lý của việc đặt task trong ngày: giờ vàng có bị lấp không, task nặng có dồn quá không, và có thiếu recovery không.
      </p>
    </section>
  );
}