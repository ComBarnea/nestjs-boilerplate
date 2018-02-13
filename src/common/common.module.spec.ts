import { CommonModule } from './common.module';

describe('CommonModule', () => {
    const commonModule = new CommonModule();
    const middleWaresConsumer = {
        apply: jest.fn( () => middleWaresConsumer),
        with: jest.fn( () => middleWaresConsumer),
        forRoutes: jest.fn( () => middleWaresConsumer),
    };

    it('should call all needed methods', async () => {
        commonModule.configure(middleWaresConsumer);

        expect(middleWaresConsumer.apply).toHaveBeenCalledTimes(1);
        expect(middleWaresConsumer.with).toHaveBeenCalledTimes(1);
        expect(middleWaresConsumer.forRoutes).toHaveBeenCalledTimes(1);
        expect(middleWaresConsumer.forRoutes.mock.calls[0][0].method).toBe(5);
    });
});