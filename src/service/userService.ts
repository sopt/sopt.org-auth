import { FacebookAPIRepository } from "../repository/facebookAPI";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { UserRepository } from "../repository/user";

const SOPT_NOTICE_GROUP_ID = "1392673424331756";

export interface UserService {
  verifyByFacebook(code: string): Promise<boolean>;
}

interface UserServiceDeps {
  facebookAPIRepository: FacebookAPIRepository;
  facebookAuthRepository: FacebookAuthRepository;
  userRepository: UserRepository;
}

export function createUserService({
  facebookAPIRepository,
  facebookAuthRepository,
  userRepository,
}: UserServiceDeps): UserService {
  return {
    async verifyByFacebook(code) {
      const accessToken = await facebookAPIRepository.getAccessTokenByCode(code);
      if (!accessToken) {
        return false;
      }

      const fbUserInfo = await facebookAPIRepository.getAccessTokenInfo(accessToken);
      const fbInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);
      if (!fbInfo) {
        return false;
      }
      const groupInfo = await facebookAPIRepository.getGroupInfo(fbInfo.authId, accessToken);

      const soptNotice = groupInfo.find((group) => group.groupId === SOPT_NOTICE_GROUP_ID);
      if (!soptNotice) {
        return false;
      }

      const createdUser = await userRepository.createUser({
        name: fbUserInfo.userId,
      });
      await facebookAuthRepository.setUserId(fbInfo.authId, createdUser.userId);

      return true;
    },
  };
}
