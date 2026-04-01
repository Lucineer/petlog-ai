// Pet tracker domain classes for petlog.ai

// --- Types ---

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthday: string;
  createdAt: string;
}

export interface HealthEntry {
  id: string;
  petId: string;
  type: "vet_visit" | "vaccination" | "weight";
  date: string;
  notes: string;
  weight?: number;
  vetName?: string;
  vaccine?: string;
}

export interface FeedingEntry {
  id: string;
  petId: string;
  time: string;
  diet: string;
  amount: string;
  recurring: boolean;
  days: string[];
}

export interface ActivityEntry {
  id: string;
  petId: string;
  type: "walk" | "play" | "training";
  date: string;
  duration: number;
  notes: string;
}

export interface Reminder {
  id: string;
  petId: string;
  type: string;
  date: string;
  notes: string;
  triggered: boolean;
}

// --- PetProfile ---

export class PetProfile {
  private pets: Map<string, Pet> = new Map();

  create(data: Omit<Pet, "id" | "createdAt">): Pet {
    const pet: Pet = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.pets.set(pet.id, pet);
    return pet;
  }

  list(): Pet[] {
    return [...this.pets.values()];
  }

  get(id: string): Pet | undefined {
    return this.pets.get(id);
  }

  update(id: string, data: Partial<Omit<Pet, "id" | "createdAt">>): Pet | null {
    const pet = this.pets.get(id);
    if (!pet) return null;
    Object.assign(pet, data);
    return pet;
  }

  delete(id: string): boolean {
    return this.pets.delete(id);
  }
}

// --- HealthRecord ---

export class HealthRecord {
  private entries: Map<string, HealthEntry> = new Map();

  add(data: Omit<HealthEntry, "id">): HealthEntry {
    const entry: HealthEntry = { id: crypto.randomUUID(), ...data };
    this.entries.set(entry.id, entry);
    return entry;
  }

  list(petId: string): HealthEntry[] {
    return [...this.entries.values()]
      .filter((e) => e.petId === petId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get(id: string): HealthEntry | undefined {
    return this.entries.get(id);
  }

  delete(id: string): boolean {
    return this.entries.delete(id);
  }
}

// --- FeedingSchedule ---

export class FeedingSchedule {
  private entries: Map<string, FeedingEntry> = new Map();

  add(data: Omit<FeedingEntry, "id">): FeedingEntry {
    const entry: FeedingEntry = { id: crypto.randomUUID(), ...data };
    this.entries.set(entry.id, entry);
    return entry;
  }

  list(petId: string): FeedingEntry[] {
    return [...this.entries.values()].filter((e) => e.petId === petId);
  }

  delete(id: string): boolean {
    return this.entries.delete(id);
  }
}

// --- ActivityTracker ---

export class ActivityTracker {
  private entries: Map<string, ActivityEntry> = new Map();

  add(data: Omit<ActivityEntry, "id">): ActivityEntry {
    const entry: ActivityEntry = { id: crypto.randomUUID(), ...data };
    this.entries.set(entry.id, entry);
    return entry;
  }

  list(petId: string): ActivityEntry[] {
    return [...this.entries.values()]
      .filter((e) => e.petId === petId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  delete(id: string): boolean {
    return this.entries.delete(id);
  }
}

// --- VetReminder ---

export class VetReminder {
  private reminders: Map<string, Reminder> = new Map();

  add(data: Omit<Reminder, "id" | "triggered">): Reminder {
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      triggered: false,
      ...data,
    };
    this.reminders.set(reminder.id, reminder);
    return reminder;
  }

  list(petId: string): Reminder[] {
    return [...this.reminders.values()]
      .filter((r) => r.petId === petId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  due(petId: string): Reminder[] {
    const now = new Date();
    return this.list(petId).filter(
      (r) => !r.triggered && new Date(r.date) <= now
    );
  }

  dismiss(id: string): boolean {
    const r = this.reminders.get(id);
    if (!r) return false;
    r.triggered = true;
    return true;
  }
}
