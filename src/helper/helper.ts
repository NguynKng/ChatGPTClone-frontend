export function autoFixMarkdownTable(content: string): string {
  // Tách tất cả cell
  const cells = content
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Nếu không phải dạng bảng, trả nguyên
  if (cells.length < 4) return content;

  // Tìm candidate column counts
  const counts: number[] = [];
  for (let cols = 2; cols <= Math.floor(cells.length / 2); cols++) {
    if (cells.length % cols === 0) {
      counts.push(cols);
    }
  }

  // Chọn cột tối ưu = số cột nhỏ nhất hợp lý
  const numColumns = counts.length > 0 ? counts[0] : cells.length;

  // Nếu không chia đều được thì fallback
  if (cells.length % numColumns !== 0) return content;

  // Tạo bảng markdown
  const header = cells.slice(0, numColumns);
  const separator = Array(numColumns).fill("---");

  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
  ];

  for (let i = numColumns; i < cells.length; i += numColumns) {
    lines.push(`| ${cells.slice(i, i + numColumns).join(" | ")} |`);
  }

  return lines.join("\n");
}
