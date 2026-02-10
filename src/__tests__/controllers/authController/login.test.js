const login = require('../../../controllers/authController/login');
const authService = require('../../../services/authService');
const helpers = require('../../../helpers');
const enums = require('../../../enums');

jest.mock('../../../services/authService');
jest.mock('../../../helpers');

describe('Login Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@mail.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    next = jest.fn();

    enums.statusCode = {
      OK: 200,
      BAD_REQUEST: 400,
    };

    helpers.getErrorResponse.mockReturnValue({
      code: 'ERR_DEFAULT',
      message: 'Unexpected error',
    });

    helpers.createErrorLog.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is invalid', async () => {
    authService.getUserByEmail.mockResolvedValue(null);

    await login(req, res, next);

    expect(authService.getUserByEmail).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid email or password',
    });
  });

  it('should return 200 and token data when login success', async () => {
    const mockUser = {
      id: 1,
      email: 'test@mail.com',
      password: 'hashed-password',
      roleId: 2,
    };

    const mockMenu = {
      afterLogin: '/dashboard',
    };

    authService.getUserByEmail.mockResolvedValue(mockUser);
    authService.checkPassword.mockResolvedValue(true);
    authService.getMenu.mockResolvedValue(mockMenu);
    authService.generateToken.mockReturnValue('mock-token');
    authService.getCookieSetting.mockReturnValue({ httpOnly: true });
    authService.getTokenExpiredSecond.mockReturnValue(3600);
    authService.getTokenExpiredDate.mockReturnValue('2026-01-30');

    await login(req, res, next);

    expect(authService.checkPassword).toHaveBeenCalledWith(req.body.password, mockUser.password);

    expect(res.cookie).toHaveBeenCalledWith('access_token', 'mock-token', { httpOnly: true });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'You have successfully logged in',
      data: {
        afterLogin: '/dashboard',
        expiredIn: 3600,
        expiredAt: '2026-01-30',
      },
    });
  });

  it('should call next and create error log when error happens', async () => {
    const error = new Error('DB Error');

    authService.getUserByEmail.mockRejectedValue(error);
    helpers.getErrorResponse.mockReturnValue({
      code: 'ERR_001',
      message: 'DB Error',
    });
    helpers.createErrorLog.mockResolvedValue();

    await login(req, res, next);

    expect(helpers.getErrorResponse).toHaveBeenCalledWith('DB Error');
    expect(helpers.createErrorLog).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
