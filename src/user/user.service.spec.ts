import { PrismaMockProvider, prismaMock } from '../common/prisma/prisma.mock';
import { UserService } from './user.service';
import { Test } from '@nestjs/testing';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, PrismaMockProvider],
    }).compile();

    userService = moduleRef.get(UserService);
  });

  const mockUser = { name: 'John Doe', email: 'john.doe@example.com', password: 'genericpassword' };
  const mockUserWithId = { id: 1, ...mockUser };
  const updatedUser = { ...mockUserWithId, name: 'Jane Doe' };

  describe('create()', () => {
    it('should create a user with valid data', async () => {
      prismaMock.user.create.mockResolvedValue(mockUserWithId);
      const result = await userService.create(mockUser);

      expect(prismaMock.user.create).toHaveBeenCalledWith({ data: mockUser });
      expect(result).toEqual(true);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUserWithId]);
      const result = await userService.findAll();

      expect(prismaMock.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUserWithId]);
    });
  });

  describe('findOne()', () => {
    it('should return a user by ID', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUserWithId);
      const result = await userService.findOne(1);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUserWithId);
    });

    it('should return null if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await userService.findOne(999);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update a user with valid data', async () => {
      prismaMock.user.update.mockResolvedValue(updatedUser);
      const result = await userService.update(1, { name: 'Jane Doe' });

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        data: { name: 'Jane Doe' },
        where: { id: 1 },
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove()', () => {
    it('should delete a user by ID', async () => {
      prismaMock.user.delete.mockResolvedValue(mockUserWithId);
      const result = await userService.remove(1);

      expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUserWithId);
    });
  });
});
