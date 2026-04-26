import { MoonStar } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function SleepCircadianOverviewPage() {
  return (
    <ArticlePageShell
      eyebrow="Tóm tắt nguồn ngoài"
      icon={<MoonStar className="h-3 w-3" />}
      title="Tổng quan về giấc ngủ và nhịp sinh học"
      intro="Thời điểm ngủ và nhịp sinh học liên quan chặt chẽ với nhau. Nếu muốn hiểu vì sao có lúc bạn tỉnh táo hơn và có lúc bị hụt năng lượng, đây là một trong những nền tảng quan trọng nhất."
      sections={[
        {
          title: "Vì sao thời điểm ngủ quan trọng",
          content: [
            "Giấc ngủ không chỉ là ngủ bao lâu. Thời điểm ngủ cũng có thể tạo khác biệt. Một người có thể ngủ đủ giờ nhưng vẫn thấy lệch nhịp nếu thời gian ngủ của họ thường xuyên xung đột với nhịp tự nhiên hoặc yêu cầu hằng ngày.",
            "Đó là lý do ChronoFlow không nên chỉ hỏi người dùng ngủ bao nhiêu, mà còn nên quan tâm đến lúc nào họ tự nhiên thấy tỉnh hay buồn ngủ hơn.",
          ],
        },
        {
          title: "Điều này có nghĩa gì với sản phẩm",
          content: [
            "Product có thể dùng những câu hỏi liên quan đến giấc ngủ để làm insight về nhịp trở nên thực tế hơn. Chỉ cần những prompt đơn giản về giờ ngủ, giờ dậy và cảm giác minh mẫn cũng có thể giúp user thấy rõ timing của mình hơn.",
            "Về lâu dài, hệ thống cũng có thể nhắc người dùng rằng hồi phục ảnh hưởng trực tiếp đến hiệu suất ngày hôm sau, thay vì xem giấc ngủ là một chủ đề tách biệt khỏi việc lập kế hoạch.",
          ],
        },
      ]}
      takeaway="Thời điểm ngủ không phải chuyện bên lề. Nó là một trong những nền tảng định hình cách năng lượng và sự chú ý vận hành trong ngày."
      nextHref="/learn/chronotype-and-sleep-education"
      nextLabel="Tiếp theo: Chronotype và giáo dục về giấc ngủ"
      resources={[
        {
          label: "Nguồn gốc về sleep overview",
          href: "https://www.nhlbi.nih.gov/health/sleep",
          external: true,
        },
      ]}
    />
  );
}