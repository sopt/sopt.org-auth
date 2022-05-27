import { Router } from "express";

import { Services } from "../service";
import { asyncRoute } from "../util/route";
import { AuthUtil } from "../util/token";

interface VerifyRouteDeps {
  services: Services;
  authUtil: AuthUtil;
}

export function createVerifyRoute({ services }: VerifyRouteDeps) {
  const router = Router();

  router.post(
    "/facebook",
    asyncRoute(async (req, res) => {
      const code = req.query.code;
      if (typeof code !== "string") {
        res.status(400).json({
          message: "잘못된 code 값입니다.",
        });
        return;
      }

      const success = await services.userService.verifyByFacebook(code);

      res.json({
        success,
      });
    }),
  );

  return router;
}
