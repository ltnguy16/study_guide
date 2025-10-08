import { TimelineEvent } from "./timeline-item-data";

/**
 * Assigns a column/level to each event so that overlaps are offset right.
 */
export function AssignTimelineLevels(events: TimelineEvent[]) {
    // Parse dates, sort by start
    const sorted = [...events].sort((a, b) =>
    new Date(a.eventstart!).getTime() - new Date(b.eventstart!).getTime()
);

    // Deep copy with levels
    type WithLevel = TimelineEvent & { level: number };
    const result: WithLevel[] = [];

    // Track end times for each level
    const endTimes: number[] = [];

    for (const event of sorted) {
        const start = new Date(event.eventstart!).getTime();
        const end = new Date(event.eventend!).getTime();

        // Find first available level
        let level = 0;
        while (level < endTimes.length && start < endTimes[level]) {
            level += 1;
        }

        // Place event at found level, update end time
        endTimes[level] = end;
        result.push({ ...event, level });
    }
    return result;
}
