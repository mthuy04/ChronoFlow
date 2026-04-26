import { Brain } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function EnergyRhythmPage() {
  return (
    <ArticlePageShell
      eyebrow="Sinh học"
      icon={<Brain className="h-3 w-3" />}
      title="Vì sao năng lượng của bạn lên xuống trong ngày?"
      intro="Năng lượng của bạn không hề phẳng. Sự tập trung, động lực và độ minh mẫn thường thay đổi theo những nhịp khác nhau trong ngày, thay vì giữ nguyên từ sáng đến tối."
      sections={[
        {
          title: "Vì sao lịch phẳng thường thất bại",
          content: [
            "Nhiều lịch làm việc mặc định rằng giờ nào cũng có thể gánh cùng một loại việc. Đây là một lý do khiến nhiều người thấy kế hoạch trên giấy thì hợp lý nhưng trong thực tế lại rất khó theo.",
            "Nếu năng lượng của bạn thay đổi tự nhiên, thì độ khó của công việc cũng nên thay đổi theo. Vấn đề nhiều khi không nằm ở kỷ luật, mà ở việc task không khớp với timing.",
          ],
        },
        {
          title: "Điều gì ảnh hưởng đến nhịp năng lượng",
          content: [
            "Năng lượng hằng ngày có thể bị ảnh hưởng bởi giờ ngủ, chất lượng ngủ, ánh sáng, stress, bữa ăn, thói quen, môi trường và xu hướng sinh học cá nhân.",
            "Vì vậy, ChronoFlow không nên giả vờ rằng nó dự đoán hoàn hảo từng ngày. Điều hữu ích hơn là giúp bạn nhận ra một nhịp chung xuất hiện đủ thường xuyên để có ý nghĩa trong việc lập kế hoạch.",
          ],
        },
        {
          title: "ChronoFlow làm gì với insight này",
          content: [
            "ChronoFlow biến nhịp năng lượng thành những tín hiệu thực tế: lúc nào khả năng tập trung có thể mạnh hơn, lúc nào phù hợp hơn cho việc nhẹ, và lúc nào nên giữ chỗ cho hồi phục.",
            "Điều đó tạo ra một hệ thống lên kế hoạch thực tế hơn nhiều so với cách xem mọi khung giờ là giống nhau.",
          ],
        },
      ]}
      takeaway="Một lịch trình theo nhịp hiệu quả hơn vì nó tôn trọng sự thật rằng năng lượng và sự chú ý thay đổi trong suốt ngày."
      nextHref="/learn/rhythm-based-planning"
      nextLabel="Tiếp theo: Cách lên kế hoạch theo nhịp"
      resources={[
        {
          label: "Đọc tiếp về lên kế hoạch theo nhịp",
          href: "/learn/rhythm-based-planning",
        },
        {
          label: "NIGMS overview of circadian rhythms",
          href: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx",
          external: true,
        },
      ]}
    />
  );
}