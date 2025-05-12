import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 1000);

    expect(spy).toHaveBeenCalledWith(callback, 1000);
    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(2000);

    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 1000);

    expect(spy).toHaveBeenCalledWith(callback, 1000);
    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);

    jest.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const fakePath = 'test.txt';
  const fullPath = '/some/full/path/test.txt';

  beforeEach(() => {
    (path.join as jest.Mock).mockReturnValue(fullPath);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(fakePath);

    expect(path.join).toHaveBeenCalledWith(__dirname, fakePath);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(fakePath);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(Buffer.from('Hello, world!'));

    const result = await readFileAsynchronously(fakePath);

    expect(result).toBe('Hello, world!');
  });
});
