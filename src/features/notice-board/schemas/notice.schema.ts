import { z } from "zod";
import { NOTICE_AUDIENCES } from "@/features/notice-board/types";

export const noticeFormSchema = z.object({
  title: z.string().min(2, "Title is required."),
  body: z.string().min(2, "Body is required."),
  audience: z.enum(NOTICE_AUDIENCES),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;
