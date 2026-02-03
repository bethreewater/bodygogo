import { getCommunityFeedData } from '../data/supabase-repository';
import * as VisibilityFilter from './layer4_visibility/filter';
import { FeedItem } from '../core/types';

export async function getCommunityFeed(): Promise<FeedItem[]> {
    // 1. Fetch Candidates (Layer 0)
    // Repo should ideally filter by 'is_public' or we check here.
    const rows = await getCommunityFeedData();

    // 2. Transform & Filter (Layer 4)
    const feedItems: FeedItem[] = [];

    // Note: To compute semantics, we need each user's Metrics + State.
    // Ideally this is a batch query. For MVP, we might iterate (N+1 risk).
    // Optimization: getCommunityUsers() should return a composite object { profile, state, logs_summary }.
    // Assuming getCommunityUsers returns PublicProfile[], we might lack Raw Logs to compute 'calories_out'.
    // REFACTOR: We need a new repo method or helper here.

    // For this MVP step, we will use a simplified mock or assumptions if data is missing,
    // OR we acknowledge we need to fetch their state.
    // Let's assume 'getCommunityUsers' returns the data we need, or we iterate.

    // Iterate (MVP Warning: Performance)
    for (const row of rows) {
        const privacy = row.profile.privacy ?? 'private';
        if (privacy !== 'public') {
            continue;
        }
        // We need: State (Streak), Metrics (Activity).
        // Since PublicProfile from Repo is lightweight, we might need to fetch their dashboard view model?
        // That's too heavy.

        // Let's fallback to "What we have" or Mock the "Activity" part if missing from Repo.
        // PublicProfile has 'level', 'streak'.
        // It DOES NOT have 'calories_out'.
        // So 'vitality' calculation will be limited to Streak-based if we don't fetch logs.

        // MVP COMPROMISE: Use Streak only for Phase, or fetch logs.
        // Let's use the provided 'user' (PublicProfile) and map it best effort.

        // We need to map PublicProfile -> UserProfile (Partial)
        const partialProfile = {
            uid: row.profile.uid,
            avatar_config: row.profile.avatar_config,
            height_cm: 0,
            birth_date: '1970-01-01',
            sex: 'male' as const,
            activity_level: 'sedentary' as const
        };
        const partialState = row.state;
        const partialMetrics = row.metrics;

        const item = VisibilityFilter.toFeedItem(partialProfile, partialState, partialMetrics);
        if (item) {
            item.privacy = privacy;
            feedItems.push(item);
        }
    }

    return feedItems;
}
