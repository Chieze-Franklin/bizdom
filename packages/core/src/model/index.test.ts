import { ID } from "../types";

class AchievementDefinition {
  id?: ID;
  issueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

describe('Model', () => {
  it('can create a model from a model definition', () => {
    // const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
    // expect(achievementModel).toBeTruthy();
    // expect(achievementModel.definitionType).toEqual(AchievementDefinition);
  });
});
