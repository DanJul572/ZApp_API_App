const login = require('../../../controllers/authController/login');
const authService = require('../../../services/authService');

jest.mock('../../../services/authService');
jest.mock('../../../enums', () => ({
  statusCode: {
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

describe('login controller', () => {
  let req, res;

  beforeEach(() => {
    req = {body: {email: 'test@example.com', password: 'password123'}};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return accessToken and afterLogin on successful login', async () => {
    const user = {email: 'test@example.com', password: 'hashed', roleId: 1};
    const menu = {afterLogin: '/dashboard'};
    const token = 'jwt.token';

    authService.getUserByEmail.mockResolvedValue(user);
    authService.checkPassword.mockResolvedValue(true);
    authService.getMenu.mockResolvedValue(menu);
    authService.generateToken.mockReturnValue(token);

    await login(req, res);

    expect(authService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(authService.checkPassword).toHaveBeenCalledWith('password123', 'hashed');
    expect(authService.getMenu).toHaveBeenCalledWith(1);
    expect(authService.generateToken).toHaveBeenCalledWith(user, menu);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'successful login',
      data: {
        afterLogin: '/dashboard',
        accessToken: 'jwt.token',
      },
    });
  });

  it('should return BAD_REQUEST if user not found or password mismatch', async () => {
    authService.getUserByEmail.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: 'user not found',
    });
  });

  it('should return BAD_REQUEST if password does not match', async () => {
    const user = {email: 'test@example.com', password: 'hashed', roleId: 1};
    authService.getUserByEmail.mockResolvedValue(user);
    authService.checkPassword.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: 'invalid password',
    });
  });

  it('should return INTERNAL_SERVER_ERROR on exception', async () => {
    authService.getUserByEmail.mockRejectedValue(new Error('DB error'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});
