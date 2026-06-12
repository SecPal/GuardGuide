import '@testing-library/jest-dom/vitest';

class TestResizeObserver implements ResizeObserver {
    observe(): void {}

    unobserve(): void {}

    disconnect(): void {}
}

globalThis.ResizeObserver = TestResizeObserver;

Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: () => null,
});
