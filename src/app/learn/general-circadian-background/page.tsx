import { Brain } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function GeneralCircadianBackgroundPage() {
  return (
    <ArticlePageShell
      eyebrow="Tóm tắt nguồn ngoài"
      icon={<Brain className="h-3 w-3" />}
      title="Bối cảnh chung về nhịp sinh học"
      intro="Nhịp sinh học là nền bối cảnh rộng hơn phía sau timing hằng ngày. ChronoFlow không cần biến người dùng thành nhà khoa học, nhưng nên cho họ đủ hiểu biết để sản phẩm trở nên đáng tin và hữu ích hơn."
      sections={[
        {
          title: "Vì sao phần nền này giúp ích",
          content: [
            "Khi người dùng hiểu rằng timing có một chiều sinh học, họ sẽ dễ chấp nhận hơn rằng năng lượng không thay đổi ngẫu nhiên. Điều đó giúp sản phẩm bớt giống lời khuyên động lực chung chung và trở nên đáng tin hơn.",
            "Điều này đặc biệt hữu ích với những người còn hoài nghi. Càng thấy rằng nhịp có nền tảng thực tế, họ càng dễ xem trọng những gợi ý lập kế hoạch hơn.",
          ],
        },
        {
          title: "Bao nhiêu khoa học là đủ",
          content: [
            "ChronoFlow nên giải thích vừa đủ để tạo độ tin cậy, nhưng không nên đẩy trải nghiệm thành quá học thuật hay nặng nề. Mức vừa đủ thường là khi người dùng có thể nối ý tưởng đó với cuộc sống của họ.",
            "Trong thực tế, các đoạn giải thích ngắn, ví dụ rõ ràng và link đọc thêm tùy chọn thường hiệu quả hơn nhiều so với những bức tường chữ quá kỹ thuật.",
          ],
        },
      ]}
      takeaway="Bối cảnh về nhịp sinh học giúp product có nền tảng, nhưng tính hữu ích thực tế vẫn luôn phải là trung tâm."
      nextHref="/learn"
      nextLabel="Quay lại learning hub"
      resources={[
        {
          label: "NIGMS circadian rhythm overview",
          href: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx",
          external: true,
        },
      ]}
    />
  );
}