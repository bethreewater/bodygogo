import { describe, it, expect } from 'vitest';
import { checkDataCompleteness, getCompletenessDetails, canCalculateMetric } from '../layer0_completeness/checker';
import type { RawLogs } from '../layer0_completeness/checker';

describe('Layer 0: Completeness Checker', () => {
    describe('checkDataCompleteness', () => {
        it('should return "unknown" when no logs exist', () => {
            const logs: RawLogs = {
                body: [],
                food: [],
                workout: []
            };
            expect(checkDataCompleteness(logs)).toBe('unknown');
        });

        it('should return "partial" when only food logs exist', () => {
            const logs: RawLogs = {
                body: [],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: []
            };
            expect(checkDataCompleteness(logs)).toBe('partial');
        });

        it('should return "partial" when only workout logs exist', () => {
            const logs: RawLogs = {
                body: [],
                food: [],
                workout: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', type: 'running', duration_minutes: 30, calories: 300 }]
            };
            expect(checkDataCompleteness(logs)).toBe('partial');
        });

        it('should return "partial" when only body logs exist', () => {
            const logs: RawLogs = {
                body: [{ id: '1', timestamp: '2026-02-01T08:00:00Z', date: '2026-02-01', weight_kg: 70, source: 'user' }],
                food: [],
                workout: []
            };
            expect(checkDataCompleteness(logs)).toBe('partial');
        });

        it('should return "partial" when two out of three log types exist', () => {
            const logs: RawLogs = {
                body: [],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', type: 'running', duration_minutes: 30, calories: 300 }]
            };
            expect(checkDataCompleteness(logs)).toBe('partial');
        });

        it('should return "complete" when all three log types exist', () => {
            const logs: RawLogs = {
                body: [{ id: '1', timestamp: '2026-02-01T08:00:00Z', date: '2026-02-01', weight_kg: 70, source: 'user' }],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', type: 'running', duration_minutes: 30, calories: 300 }]
            };
            expect(checkDataCompleteness(logs)).toBe('complete');
        });
    });

    describe('getCompletenessDetails', () => {
        it('should return correct details structure', () => {
            const logs: RawLogs = {
                body: [],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: []
            };

            const details = getCompletenessDetails(logs, '2026-01-31');

            expect(details).toEqual({
                overall: 'partial',
                food: true,
                workout: false,
                body: false,
                lastCompleteDate: '2026-01-31'
            });
        });
    });

    describe('canCalculateMetric', () => {
        it('should return false for net_calories when food is missing', () => {
            const logs: RawLogs = {
                body: [],
                food: [],
                workout: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', type: 'running', duration_minutes: 30, calories: 300 }]
            };
            expect(canCalculateMetric('net_calories', logs)).toBe(false);
        });

        it('should return false for net_calories when workout is missing', () => {
            const logs: RawLogs = {
                body: [],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: []
            };
            expect(canCalculateMetric('net_calories', logs)).toBe(false);
        });

        it('should return true for net_calories when both food and workout exist', () => {
            const logs: RawLogs = {
                body: [],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', type: 'running', duration_minutes: 30, calories: 300 }]
            };
            expect(canCalculateMetric('net_calories', logs)).toBe(true);
        });

        it('should return true for calories_in when food exists', () => {
            const logs: RawLogs = {
                body: [],
                food: [{ id: '1', timestamp: '2026-02-01T10:00:00Z', date: '2026-02-01', name: 'Breakfast', calories: 500 }],
                workout: []
            };
            expect(canCalculateMetric('calories_in', logs)).toBe(true);
        });

        it('should return true for bmr when body logs exist', () => {
            const logs: RawLogs = {
                body: [{ id: '1', timestamp: '2026-02-01T08:00:00Z', date: '2026-02-01', weight_kg: 70, source: 'user' }],
                food: [],
                workout: []
            };
            expect(canCalculateMetric('bmr', logs)).toBe(true);
        });
    });
});
