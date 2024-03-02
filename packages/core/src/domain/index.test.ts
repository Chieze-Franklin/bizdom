import { Domain } from '.';
import { IQueryBuilder, IRepository } from '../repository';
import { ID, OperationResult, SaveInput, UpdateInput } from '../types';

class Character {
  id?: ID;
  name: string = "name";
  createdAt?: Date;
  updatedAt?: Date;
}

class CharacterRepository implements IRepository<Character> {
    delete(id: string): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    deleteMany(params: IQueryBuilder<Character>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    get(id: string): Promise<Character | null> {
        throw new Error('Method not implemented.');
    }
    getMany(params: IQueryBuilder<Character>): Promise<Character[]> {
        throw new Error('Method not implemented.');
    }
    save(data: SaveInput<Character>): Promise<Character> {
        throw new Error('Method not implemented.');
    }
    update(id: string, data: UpdateInput<Character>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    updateMany(params: IQueryBuilder<Character>, data: UpdateInput<Character>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
}

describe('Domain', () => {
  it('can add a repository to a domain', () => {
    const domain = new Domain();
    domain.addService('character', new CharacterRepository());
    expect((domain as any)['character']).toBeTruthy();
    expect(domain.$('character')).toBeTruthy();
  });

  // it('should not add a model that has already been added to a domain', () => {
  //   const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
  //   const domain = new Domain('domain 1');
  //   const domain2 = new Domain('domain 2');
  //   domain.addModel('achievement', achievementModel);
  //   expect(() => domain.addModel('achievement', achievementModel)).toThrow();
  //   expect(() => domain2.addModel('achievement', achievementModel)).toThrow();
  //   expect(() => domain.addModel('another name', achievementModel)).toThrow();
  // });

  // it('should not add a model with a name that has been used before', () => {
  //   const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
  //   const achievementModel2 = new Model<AchievementDefinition>(AchievementDefinition);
  //   const domain = new Domain();
  //   domain.addModel('achievement', achievementModel);
  //   expect(() => domain.addModel('achievement', achievementModel)).toThrow();
  //   expect(() => domain.addModel('achievement', achievementModel2)).toThrow();
  // });

  // it('should not add a model with a name that has been used before 2', () => {
  //   const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);
  //   const achievementModel2 = new Model<AchievementDefinition>(AchievementDefinition);
  //   const domain = new Domain();
  //   domain.addService('achievement', achievementModel);
  //   domain['achievement'] = achievementModel;
  //   expect(() => domain.addModel('achievement', achievementModel)).toThrow();
  //   expect(() => domain.addModel('achievement', achievementModel2)).toThrow();
  // });
});
