"use client";

import { Briefcase, GraduationCap, Presentation, Sparkles } from "lucide-react";

const users = [
  {
    title: "Học sinh / sinh viên",
    desc: "Biết lúc nào nên học sâu, ôn tập, làm bài nhẹ để tránh học sai thời điểm.",
    icon: GraduationCap,
  },
  {
    title: "Người đi làm",
    desc: "Sắp deep work, họp, email và recovery theo nhịp năng lượng trong ngày.",
    icon: Briefcase,
  },
  {
    title: "Giáo dục / mentoring / team nhỏ",
    desc: "Hiểu nhịp học/làm của từng người để tư vấn lịch học, lịch làm phù hợp hơn.",
    icon: Presentation,
  },
];

export default function TargetUsersSection() {
  return (
    <section id="target-users" className="relative overflow-hidden bg-[#F4F2FA] px-4 py-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="rounded-[36px] border border-white/80 bg-white/72 px-5 py-12 shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-16">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Người dùng phù hợp
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
              Dành cho người cần quản lý{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                năng lượng, không chỉ thời gian.
              </span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {users.map((user) => {
              const Icon = user.icon;

              return (
                <article
                  key={user.title}
                  className="rounded-[30px] border border-[#EAE8F7] bg-white/82 p-6 shadow-[0_18px_48px_rgba(26,21,40,0.045)]"
                >
                  <div className="mb-5 grid h-13 w-13 place-items-center rounded-[20px] bg-[#F3F0FF] text-[#6F59FF]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[20px] font-[900] tracking-tight text-[#1A1528]">
                    {user.title}
                  </h3>
                  <p className="mt-3 text-[14px] font-semibold leading-7 text-[#5B566E]">
                    {user.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
