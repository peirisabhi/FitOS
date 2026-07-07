import { memberRepository } from "@/features/members/repository";

export const memberService = {
  list: memberRepository.list,
  getById: memberRepository.getById,
  create: memberRepository.create,
  update: memberRepository.update,
  remove: memberRepository.remove,
};
