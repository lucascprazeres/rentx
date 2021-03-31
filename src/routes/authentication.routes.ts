import { Router } from "express";

import { AuthenticateUserControlller } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticationRoutes = Router();

const authenticateUserController = new AuthenticateUserControlller();

authenticationRoutes.post("/sessions", authenticateUserController.handle);

export { authenticationRoutes };
