import { describe, expect, it } from 'vitest';

describe('placeholder ui tests', () => {
  it('tab labels are defined', () => {
    const tabs = ['Routes', 'Compare', 'Banking', 'Pooling'];
    expect(tabs).toContain('Routes');
    expect(tabs).toHaveLength(4);
  });
});
