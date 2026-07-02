import type { CreateTripInput, Trip, TripActivity, TripExpense } from '@/types/trip';

const MOCK_TRIP_PREFIX = 'mock-trip-';
const MOCK_STORAGE_KEY = 'waynxt_mock_trips';

interface MockTripStore {
  trips: Record<string, Trip>;
}

function readStore(): MockTripStore {
  if (typeof window === 'undefined') return { trips: {} };
  try {
    const raw = sessionStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockTripStore) : { trips: {} };
  } catch {
    return { trips: {} };
  }
}

function writeStore(store: MockTripStore): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
}

export function isMockTripId(id: string): boolean {
  return id.startsWith(MOCK_TRIP_PREFIX);
}

export function saveMockTrip(trip: Trip): void {
  const store = readStore();
  store.trips[trip.id] = trip;
  writeStore(store);
}

export function getMockTrip(id: string): Trip | null {
  return readStore().trips[id] ?? null;
}

export function updateMockTrip(trip: Trip): void {
  saveMockTrip(trip);
}

export function deleteMockTrip(id: string): void {
  const store = readStore();
  delete store.trips[id];
  writeStore(store);
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/** 10 curated demo places across 4 Egyptian cities, each with a real Unsplash photo. */
interface MockPlaceSeed {
  city: string;
  category: string;
  activity_name: string;
  description: string;
  duration_hours: number;
  start_time: string;
  end_time: string;
  estimated_cost: number;
  rating: number;
  activity_type: string;
  image_url: string;
}

const MOCK_PLACES: MockPlaceSeed[] = [
  {
    city: 'Cairo',
    category: 'Archaeological',
    activity_name: 'Giza Pyramids & Sphinx',
    description: 'Stand before the last surviving wonder of the ancient world.',
    duration_hours: 4,
    start_time: '08:00',
    end_time: '12:00',
    estimated_cost: 500,
    rating: 4.9,
    activity_type: 'historical',
    image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Cairo',
    category: 'Museum',
    activity_name: 'The Egyptian Museum',
    description: 'Home to Tutankhamun’s treasures and thousands of artifacts.',
    duration_hours: 3,
    start_time: '13:00',
    end_time: '16:00',
    estimated_cost: 300,
    rating: 4.8,
    activity_type: 'cultural',
    image_url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Cairo',
    category: 'Market',
    activity_name: 'Khan el-Khalili Bazaar',
    description: 'Wander the vibrant medieval souk for spices and crafts.',
    duration_hours: 2,
    start_time: '17:00',
    end_time: '19:00',
    estimated_cost: 150,
    rating: 4.5,
    activity_type: 'shopping',
    image_url: 'https://images.unsplash.com/photo-1601999009164-354a54962c19?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Alexandria',
    category: 'Historical',
    activity_name: 'Citadel of Qaitbay',
    description: 'A 15th-century fortress on the Mediterranean shoreline.',
    duration_hours: 2,
    start_time: '10:00',
    end_time: '12:00',
    estimated_cost: 200,
    rating: 4.6,
    activity_type: 'historical',
    image_url: 'https://images.unsplash.com/photo-1590126841369-6b1e9d0c0d0e?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Alexandria',
    category: 'Library',
    activity_name: 'Bibliotheca Alexandrina',
    description: 'A modern revival of the legendary ancient library.',
    duration_hours: 2,
    start_time: '14:00',
    end_time: '16:00',
    estimated_cost: 180,
    rating: 4.7,
    activity_type: 'cultural',
    image_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Luxor',
    category: 'Archaeological',
    activity_name: 'Valley of the Kings',
    description: 'Descend into the painted tombs of ancient pharaohs.',
    duration_hours: 3,
    start_time: '07:00',
    end_time: '10:00',
    estimated_cost: 400,
    rating: 4.9,
    activity_type: 'historical',
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Luxor',
    category: 'Temple',
    activity_name: 'Karnak Temple Complex',
    description: 'The largest religious building ever constructed.',
    duration_hours: 2,
    start_time: '11:00',
    end_time: '13:00',
    estimated_cost: 250,
    rating: 4.8,
    activity_type: 'cultural',
    image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Luxor',
    category: 'Adventure',
    activity_name: 'Hot Air Balloon at Sunrise',
    description: 'Float over the Nile and West Bank at dawn.',
    duration_hours: 2,
    start_time: '05:30',
    end_time: '07:30',
    estimated_cost: 1200,
    rating: 5.0,
    activity_type: 'adventure',
    image_url: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Hurghada',
    category: 'Beach',
    activity_name: 'Red Sea Snorkeling',
    description: 'Discover coral reefs and colorful marine life.',
    duration_hours: 4,
    start_time: '09:00',
    end_time: '13:00',
    estimated_cost: 700,
    rating: 4.7,
    activity_type: 'beach',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Hurghada',
    category: 'Nature',
    activity_name: 'Desert Safari & Bedouin Dinner',
    description: 'Ride quad bikes across dunes and dine under the stars.',
    duration_hours: 5,
    start_time: '15:00',
    end_time: '20:00',
    estimated_cost: 850,
    rating: 4.6,
    activity_type: 'nature',
    image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
  },
];

const CITY_ORDER = ['Cairo', 'Alexandria', 'Luxor', 'Hurghada'];
const CITY_CATEGORY: Record<string, string> = {
  Cairo: 'Archaeological',
  Alexandria: 'Coastal',
  Luxor: 'Historical',
  Hurghada: 'Beach',
};

export function generateMockTrip(input: CreateTripInput): Trip {
  const id = `${MOCK_TRIP_PREFIX}${Date.now()}`;
  const interests = input.preferences.interests?.join(' & ') ?? 'Egypt';
  const now = new Date().toISOString();

  const grouped = new Map<string, MockPlaceSeed[]>();
  for (const place of MOCK_PLACES) {
    const list = grouped.get(place.city) ?? [];
    list.push(place);
    grouped.set(place.city, list);
  }

  let dayCounter = 0;
  const destinations = CITY_ORDER.filter((city) => grouped.has(city)).map((city, cityIndex) => {
    const places = grouped.get(city)!;
    dayCounter += 1;
    const dayNumber = dayCounter;

    const activities: TripActivity[] = places.map((place, placeIndex) => ({
      id: `act-${id}-${cityIndex}-${placeIndex}`,
      trip_day_id: `day-${id}-${cityIndex}`,
      activity_name: place.activity_name,
      description: place.description,
      category: place.category,
      duration_hours: place.duration_hours,
      start_time: place.start_time,
      end_time: place.end_time,
      estimated_cost: place.estimated_cost,
      rating: place.rating,
      order_in_day: placeIndex + 1,
      activity_type: place.activity_type,
      image_url: place.image_url,
    }));

    return {
      id: `dest-${id}-${cityIndex}`,
      trip_id: id,
      city,
      days_allocated: 1,
      category: CITY_CATEGORY[city] ?? 'General',
      order_in_trip: cityIndex + 1,
      trip_days: [
        {
          id: `day-${id}-${cityIndex}`,
          trip_id: id,
          trip_destination_id: `dest-${id}-${cityIndex}`,
          day_number: dayNumber,
          date: addDays(input.start_date, dayNumber - 1),
          hours_used: activities.reduce((sum, a) => sum + a.duration_hours, 0),
          activities,
        },
      ],
    };
  });

  const expenses: TripExpense[] = [
    {
      id: `exp-${id}-1`,
      trip_id: id,
      amount: 1200,
      currency: 'EGP',
      category: 'accommodation',
      description: 'Hotel — Cairo (2 nights)',
      date: addDays(input.start_date, 0),
      created_at: now,
    },
    {
      id: `exp-${id}-2`,
      trip_id: id,
      amount: 350,
      currency: 'EGP',
      category: 'food',
      description: 'Local restaurants & street food',
      date: addDays(input.start_date, 1),
      created_at: now,
    },
  ];

  const trip: Trip = {
    id,
    user_id: 'mock-user',
    title: `${interests} Trip to Egypt (Demo)`,
    start_date: input.start_date,
    end_date: input.end_date,
    travelers_count: input.travelers_count,
    status: 'draft',
    preferences: input.preferences,
    created_at: now,
    updated_at: now,
    destinations,
    expenses,
  };

  saveMockTrip(trip);
  return trip;
}

export function addMockExpense(tripId: string, expense: Omit<TripExpense, 'id' | 'trip_id'>): TripExpense {
  const trip = getMockTrip(tripId);
  if (!trip) throw new Error('Mock trip not found');

  const newExpense: TripExpense = {
    ...expense,
    id: `exp-${tripId}-${Date.now()}`,
    trip_id: tripId,
    created_at: new Date().toISOString(),
  };

  trip.expenses = [...(trip.expenses ?? []), newExpense];
  trip.updated_at = new Date().toISOString();
  updateMockTrip(trip);
  return newExpense;
}

export function updateMockExpense(
  tripId: string,
  expenseId: string,
  updates: Partial<TripExpense>
): TripExpense {
  const trip = getMockTrip(tripId);
  if (!trip) throw new Error('Mock trip not found');

  const index = trip.expenses?.findIndex((e) => e.id === expenseId) ?? -1;
  if (index === -1) throw new Error('Expense not found');

  const updated = { ...trip.expenses![index], ...updates, updated_at: new Date().toISOString() };
  trip.expenses![index] = updated;
  trip.updated_at = new Date().toISOString();
  updateMockTrip(trip);
  return updated;
}

export function deleteMockExpense(tripId: string, expenseId: string): void {
  const trip = getMockTrip(tripId);
  if (!trip) throw new Error('Mock trip not found');

  trip.expenses = trip.expenses?.filter((e) => e.id !== expenseId) ?? [];
  trip.updated_at = new Date().toISOString();
  updateMockTrip(trip);
}
