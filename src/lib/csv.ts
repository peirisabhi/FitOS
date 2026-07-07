/**
 * Client-side CSV export — genuinely functional (not a mocked "Export"
 * button): serializes rows to CSV and triggers a real browser download via
 * a Blob + temporary anchor. No backend endpoint needed for this.
 */
export function exportToCsv(filename: string, rows: Record<string, string | number>[]): void {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]!);
  const escapeCell = (value: string | number): string => {
    const str = String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h] ?? "")).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
