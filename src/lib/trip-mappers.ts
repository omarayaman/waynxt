import type { UserPreferences } from '@/types/user';
import type { CreateTripInput } from '@/types/trip';

const INTEREST_MAP: Record<string, string> = {
  History: 'history',
  Beach: 'beach',
  Food: 'food',
  Wellness: 'wellness',
  Religious: 'religious',
  Nature: 'nature',
  Adventure: 'adventure',
};

const COMPANION_MAP: Record<string, UserPreferences['travel_companion']> = {
  Solo: 'solo',
  Couple: 'couple',
  Family: 'family',
  Friends: 'friends',
};

const BUDGET_MAP: Record<string, UserPreferences['budget']> = {
  Budget: 'low',
  'Mid-range': 'medium',
  Luxury: 'high',
};

const AGE_MAP: Record<string, UserPreferences['age_group']> = {
  Teen: 'teen',
  Adult: 'adult',
  Senior: 'senior',
};

const CROWD_MAP: Record<string, UserPreferences['crowd_preference']> = {
  Lively: 'crowded',
  'No preference': 'no_preference',
  Peaceful: 'quiet',
};

const SEASON_MAP: Record<string, UserPreferences['season']> = {
  Winter: 'winter',
  Spring: 'spring',
  Summer: 'summer',
  Autumn: 'autumn',
};

export function mapWizardToPreferences({
  interests,
  whoIsTraveling,
  budget,
  ageGroup,
  crowdPreference,
  season,
}: {
  interests: string[];
  whoIsTraveling: string;
  budget: string;
  ageGroup: string;
  crowdPreference: string;
  season: string;
}): UserPreferences {
  return {
    interests: interests.map((i) => INTEREST_MAP[i] ?? i.toLowerCase()),
    travel_companion: COMPANION_MAP[whoIsTraveling],
    budget: BUDGET_MAP[budget],
    age_group: AGE_MAP[ageGroup],
    crowd_preference: CROWD_MAP[crowdPreference],
    season: SEASON_MAP[season],
  };
}

export function buildCreateTripInput({
  startDate,
  journeyLength,
  travelersCount,
  interests,
  whoIsTraveling,
  budget,
  ageGroup,
  crowdPreference,
  season,
}: {
  startDate: string;
  journeyLength: number;
  travelersCount: number;
  interests: string[];
  whoIsTraveling: string;
  budget: string;
  ageGroup: string;
  crowdPreference: string;
  season: string;
}): CreateTripInput {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + journeyLength - 1);

  return {
    start_date: startDate,
    end_date: end.toISOString().split('T')[0],
    travelers_count: travelersCount,
    preferences: mapWizardToPreferences({
      interests,
      whoIsTraveling,
      budget,
      ageGroup,
      crowdPreference,
      season,
    }),
  };
}

export function defaultTravelersCount(whoIsTraveling: string): number {
  switch (whoIsTraveling) {
    case 'Solo':
      return 1;
    case 'Couple':
      return 2;
    case 'Family':
      return 4;
    case 'Friends':
      return 4;
    default:
      return 2;
  }
}

export function defaultStartDate(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}
