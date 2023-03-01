import { Domain } from '.';
import { ID, Model, ModelDefinition } from '..';

class AchievementDefinition implements ModelDefinition {
  id?: ID;
  issueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

describe('Domain', () => {
  it('can add a model to a domain', () => {
    const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
    expect(achievementModel.domain).toBeFalsy();
    expect(achievementModel.name).toBeFalsy();
    const domain = new Domain();
    domain.addModel('achievement', achievementModel);
    expect(achievementModel.domain).toBeTruthy();
    expect(achievementModel.domain).toEqual(domain);
    expect(achievementModel.name).toBeTruthy();
    expect(achievementModel.name).toEqual('achievement');
  });

  it('should not add a model that has already been added to a domain', () => {
    const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
    const domain = new Domain('domain 1');
    const domain2 = new Domain('domain 2');
    domain.addModel('achievement', achievementModel);
    expect(() => domain.addModel('achievement', achievementModel)).toThrow();
    expect(() => domain2.addModel('achievement', achievementModel)).toThrow();
    expect(() => domain.addModel('another name', achievementModel)).toThrow();
  });

  it('should not add a model with a name that has been used before', () => {
    const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
    const achievementModel2 = new Model<AchievementDefinition>(AchievementDefinition);
    const domain = new Domain();
    domain.addModel('achievement', achievementModel);
    expect(() => domain.addModel('achievement', achievementModel)).toThrow();
    expect(() => domain.addModel('achievement', achievementModel2)).toThrow();
  });
});
