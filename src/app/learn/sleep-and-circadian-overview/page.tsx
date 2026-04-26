import { BookOpen } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function ChronotypeSleepEducationPage() {
  return (
    <ArticlePageShell
      eyebrow="Tóm tắt nguồn ngoài"
      icon={<BookOpen className="h-3 w-3" />}
      title="Chronotype và giáo dục về giấc ngủ"
      intro="Một trang kiến thức tốt nên giúp người dùng hiểu timing của mình mà không khiến họ cảm thấy bị đóng khung. Điều đó đặc biệt quan trọng với ChronoFlow, vì sản phẩm này nên thực tế và hữu ích hơn là quá cứng nhắc."
      sections={[
        {
          title: "Một trang kiến thức tốt nên làm gì",
          content: [
            "Một trang giải thích tốt cần giảm bối rối, không thêm jargon. Người đọc nên rời trang với cảm giác hiểu rõ hơn vì sao họ khác nhau ở các thời điểm khác nhau trong ngày và họ có thể dùng khác biệt đó để lên kế hoạch như thế nào.",
            "Điều đó có nghĩa là ChronoFlow nên giải thích khái niệm đơn giản, nối chúng với quyết định hằng ngày và tránh tạo cảm giác như một bài test tính cách khoác áo khoa học.",
          ],
        },
        {
          title: "Giữ tone như thế nào cho đúng",
          content: [
            "Tone nên bình tĩnh, thực tế và có cảm giác dựa trên khoa học, nhưng không nên overclaim. Nó cũng không nên khiến người dùng cảm thấy họ có vấn đề chỉ vì nhịp của họ ít ổn định hoặc khác với điều thường được xem là bình thường.",
            "Đó là lý do các trang như thế này quan trọng. Chúng giữ cho product có nền tảng, giúp user tin tưởng trải nghiệm hơn và hiểu rằng insight là để hỗ trợ, không phải để phán xét.",
          ],
        },
      ]}
      takeaway="Các trang kiến thức cũng là một phần của trải nghiệm sản phẩm. Chúng giúp biến kết quả quiz thành điều người dùng có thể thật sự hiểu và áp dụng."
      nextHref="/learn/general-circadian-background"
      nextLabel="Tiếp theo: Bối cảnh chung về nhịp sinh học"
      resources={[
        {
          label: "Sleep Foundation",
          href: "https://www.sleepfoundation.org/",
          external: true,
        },
      ]}
    />
  );
}