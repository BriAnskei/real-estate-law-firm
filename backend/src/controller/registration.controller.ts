import { Response } from "express";
import { AuthRequest } from "../types/express.types.js";
import { RegistrationRequestService } from "../service/registration_request.service.js";

export class RegistrationController {
  static async fetchAllRegistration(req: AuthRequest, res: Response) {
    const userId = req.userId;

    const response =
      await RegistrationRequestService.getAllRegistrationRequests(userId!);

    if (!response.success) {
      throw new Error(response.message);
    }

    res.json({ success: true, data: response.data });
  }

  static async filter(req: AuthRequest, res: Response) {
    const { filterInput } = req.query;

    const filterResponse = await RegistrationRequestService.findByEmailOrName(
      filterInput as string
    );
    res.json({ success: true, data: filterResponse });
  }

  static async approveRegistration(req: AuthRequest, res: Response) {
    const { registrationReq } = req.body;

    await RegistrationRequestService.registrationApproval(registrationReq);

    res.json({ success: true });
  }

  static async rejectRegistrationRequest(req: AuthRequest, res: Response) {
    const { registrationReq, reason } = req.body;

    await RegistrationRequestService.rejectRegistrationRequest({
      registrationReq,
      reason,
    });

    res.json({ success: true });
  }
}
