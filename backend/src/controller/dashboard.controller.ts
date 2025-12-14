import { Request, Response } from "express";
import { CaseService } from "../service/case.service.js";
import { TaskService } from "../service/task.service.js";
import { UsersService } from "../service/user.service.js";
import { CaseStageService } from "../service/case_stage.service.js";
import { HearingService } from "../service/hearing.service.js";
import { AuthRequest } from "../types/express.types.js";

export class DashboardController {
  static async fetchAdminDashboard(_: Request, res: Response): Promise<void> {
    // case cards: total, ongoing, completed
    const cardsData = await CaseService.getAllCasesStatus();

    // on due tasks
    const dueTasks = await TaskService.getAllDueTask();

    const totalUsers = await UsersService.getAllTotalUsers();

    const stageDistributionCount =
      await CaseStageService.getOngoingCasesStageSummary();

    const upcommingHearings = await HearingService.getUpcomingHearings();

    res.json({
      success: true,
      data: {
        cards: { ...cardsData, due_tasks: dueTasks, total_users: totalUsers },
        stageDistributionCount,
        upcommingHearings,
      },
    });
  }

  static async fetchGlobalDashboard(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const userId = req.userId!;

    const pendingTaskCount = await TaskService.countPendingTasksByUser(userId);
    const activeCasesCount = await CaseService.countAllActiveCases(userId);

    const overDueTasks = await TaskService.fetchOverDueTaskByUser(userId);
    const dueIn3Days = await TaskService.fetchTasksDueIn3Days(userId);
    const dueIn5Days = await TaskService.fetchTasksDueIn5Days(userId);

    const upcommingHearings = await HearingService.getUpcomingHearings();
    const upcommingHearingsCount =
      await HearingService.getUpcomingHearingsCount();

    res.json({
      success: true,
      data: {
        pendingTaskCount,
        overDueTasks,
        dueIn3Days,
        dueIn5Days,
        upcommingHearings,
        upcommingHearingsCount,
        activeCasesCount,
      },
    });
  }
}
