import { MoonStar } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function ChronotypeBasicsPage() {
  return (
    <ArticlePageShell
      eyebrow="Kiến thức nền"
      icon={<MoonStar className="h-3 w-3" />}
      title="Chronotype thực ra là gì?"
      intro="Chronotype là cách đơn giản để mô tả khi nào bạn tự nhiên tỉnh táo hơn, tập trung tốt hơn và sẵn sàng nghỉ ngơi hơn. Đây không phải một nhãn cố định, mà là một pattern hữu ích để hiểu timing của chính mình."
      sections={[
        {
          title: "Vì sao chronotype quan trọng",
          content: [
            "Nhiều người mặc định rằng ai cũng nên học, làm việc và hồi phục theo cùng một lịch. Trên thực tế, không phải ai cũng có khung tập trung mạnh nhất ở cùng một thời điểm.",
            "Chronotype giúp gọi tên khác biệt đó. Nó cho bạn một ngôn ngữ đơn giản để hiểu vì sao có người rất rõ đầu vào buổi sáng, trong khi người khác chỉ thật sự vào guồng muộn hơn.",
          ],
        },
        {
          title: "Một pattern hữu ích, không phải chiếc hộp cứng",
          content: [
            "Chronotype hữu ích vì nó làm cho một thực tế phức tạp trở nên dễ hiểu hơn. Nhưng phần lớn mọi người không thuộc về một cực hoàn toàn, và năng lượng hằng ngày còn bị ảnh hưởng bởi giấc ngủ, stress, môi trường, tuổi, sức khỏe và thói quen.",
            "Vì vậy, chronotype nên được dùng như một công cụ hỗ trợ lập kế hoạch, chứ không phải một định nghĩa cứng về con người bạn.",
          ],
        },
        {
          title: "ChronoFlow dùng ý tưởng này như thế nào",
          content: [
            "ChronoFlow dùng chronotype như một điểm bắt đầu để phản chiếu. Mục tiêu không phải là nói bạn sẽ luôn như thế mãi mãi, mà là giúp bạn suy nghĩ rõ hơn về timing, năng lượng và cách lên kế hoạch.",
            "Từ đó, kết quả chronotype có thể được nối tiếp thành energy curve, focus window và những gợi ý thực tế hơn cho từng ngày.",
          ],
        },
      ]}
      takeaway="Chronotype hữu ích vì nó biến cảm giác mơ hồ về thời điểm tỉnh táo thành một pattern bạn có thể hiểu và áp dụng."
      nextHref="/learn/energy-rhythm"
      nextLabel="Tiếp theo: Vì sao năng lượng lên xuống trong ngày"
      resources={[
        {
          label: "Đọc tiếp về nhịp năng lượng",
          href: "/learn/energy-rhythm",
        },
        {
          label: "Sleep Foundation",
          href: "https://www.sleepfoundation.org/",
          external: true,
        },
      ]}
    />
  );
}