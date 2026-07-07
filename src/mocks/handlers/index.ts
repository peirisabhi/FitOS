import { authHandlers } from "@/mocks/handlers/auth.handlers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard.handlers";
import { membersHandlers } from "@/mocks/handlers/members.handlers";
import { trainersHandlers } from "@/mocks/handlers/trainers.handlers";
import { mealPlansHandlers } from "@/mocks/handlers/meal-plans.handlers";
import { workoutPlansHandlers } from "@/mocks/handlers/workout-plans.handlers";
import { membershipsHandlers } from "@/mocks/handlers/memberships.handlers";
import { attendanceHandlers } from "@/mocks/handlers/attendance.handlers";
import { paymentsHandlers } from "@/mocks/handlers/payments.handlers";
import { sessionsHandlers } from "@/mocks/handlers/sessions.handlers";
import { reportsHandlers } from "@/mocks/handlers/reports.handlers";
import { notificationsHandlers } from "@/mocks/handlers/notifications.handlers";
import { noticeBoardHandlers } from "@/mocks/handlers/notice-board.handlers";
import { settingsHandlers } from "@/mocks/handlers/settings.handlers";

/**
 * Aggregate handler list. As each feature module gets a real repository,
 * its handlers file is added here — the feature's repository never
 * imports MSW directly, only this module composition does.
 */
export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...membersHandlers,
  ...trainersHandlers,
  ...mealPlansHandlers,
  ...workoutPlansHandlers,
  ...membershipsHandlers,
  ...attendanceHandlers,
  ...paymentsHandlers,
  ...sessionsHandlers,
  ...reportsHandlers,
  ...notificationsHandlers,
  ...noticeBoardHandlers,
  ...settingsHandlers,
];
