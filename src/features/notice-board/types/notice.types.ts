import type { ICrudRepository } from "@/repositories/base.repository";

export const NOTICE_AUDIENCES = ["all", "staff", "members"] as const;
export type NoticeAudience = (typeof NOTICE_AUDIENCES)[number];

export interface Notice {
  id: string;
  title: string;
  body: string;
  audience: NoticeAudience;
  pinned: boolean;
  postedAt: string;
}

export interface CreateNoticeDTO {
  title: string;
  body: string;
  audience: NoticeAudience;
}

export type UpdateNoticeDTO = Partial<CreateNoticeDTO> & { pinned?: boolean };

export type INoticeRepository = ICrudRepository<Notice, CreateNoticeDTO, UpdateNoticeDTO>;
