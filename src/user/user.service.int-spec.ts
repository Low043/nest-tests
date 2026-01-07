import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService Integration', () => {
  let userService: UserService;
  let moduleRef: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    }).compile();
    await moduleRef.init();

    userService = moduleRef.get(UserService);
    prisma = moduleRef.get(PrismaService);
  });

  beforeEach(async () => await prisma.cleanDb());
  afterAll(() => moduleRef.close());

  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'genericpassword',
  };

  const anotherUserData = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'newgenericpassword',
  };

  const sameEmailUserData = {
    ...anotherUserData,
    email: userData.email,
  };

  describe('create', () => {
    it('should create a new user on db', async () => {
      const success = await userService.create(userData);
      expect(success).toBe(true);

      const createdUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      expect(createdUser).toBeDefined();
      expect(createdUser?.id).toBe(1);
      expect(createdUser?.name).toBe(userData.name);
      expect(createdUser?.email).toBe(userData.email);
    });

    it('should throw an error if email is already in use', async () => {
      await userService.create(userData);

      expect(userService.create(sameEmailUserData)).rejects.toMatchObject({
        code: 'P2002',
      });
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no users exist', async () => {
      const users = await userService.findAll();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
      await prisma.user.create({ data: userData });
      await prisma.user.create({ data: anotherUserData });

      const users = await userService.findAll();
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('John Doe');
      expect(users[1].name).toBe('Jane Smith');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const createdUser = await prisma.user.create({ data: userData });

      const user = await userService.findOne(createdUser.id);
      expect(user).toBeDefined();
      expect(user?.id).toBe(createdUser.id);
      expect(user?.name).toBe(createdUser.name);
    });

    it('should return null if user is not found', async () => {
      const user = await userService.findOne(999);
      expect(user).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const initialUser = await prisma.user.create({ data: userData });
      const updateData = { name: 'Jane Smith' };

      const updatedUser = await userService.update(initialUser.id, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe(updateData.name);
      expect(updatedUser?.email).toBe(initialUser.email);
    });

    it('should not allow updating email to one that is already in use', async () => {
      const user1 = await prisma.user.create({ data: userData });
      const user2 = await prisma.user.create({ data: anotherUserData });

      await expect(userService.update(user2.id, { email: user1.email })).rejects.toMatchObject({
        code: 'P2002',
      });
    });

    it('should throw an error when trying to update a non-existent user', async () => {
      await expect(userService.update(999, { name: 'test' })).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const createdUser = await prisma.user.create({ data: userData });

      await userService.remove(createdUser.id);

      const user = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(user).toBeNull();
    });

    it('should throw an error when trying to delete a non-existent user', async () => {
      await expect(userService.remove(999)).rejects.toThrow();
    });
  });
});
