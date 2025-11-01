import { eq, desc, and, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, campaigns, leads, leadStatusHistory, settings, doctors, appointments, InsertCampaign, InsertLead, InsertLeadStatusHistory, InsertSetting, InsertAppointment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Campaign queries
export async function getAllCampaigns() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
}

export async function getCampaignBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(campaigns).where(eq(campaigns.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCampaignById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCampaign(campaign: InsertCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(campaigns).values(campaign);
  return result;
}

export async function updateCampaign(id: number, campaign: Partial<InsertCampaign>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(campaigns).set(campaign).where(eq(campaigns.id, id));
}

// Lead queries
export async function getAllLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(eq(leads.status, status as any)).orderBy(desc(leads.createdAt));
}

export async function getLeadsByCampaign(campaignId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(eq(leads.campaignId, campaignId)).orderBy(desc(leads.createdAt));
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(lead);
  return result;
}

export async function updateLead(id: number, lead: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(leads).set(lead).where(eq(leads.id, id));
}

export async function searchLeads(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(
    or(
      like(leads.fullName, `%${searchTerm}%`),
      like(leads.phone, `%${searchTerm}%`),
      like(leads.email, `%${searchTerm}%`)
    )
  ).orderBy(desc(leads.createdAt));
}

// Lead status history queries
export async function getLeadStatusHistory(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leadStatusHistory).where(eq(leadStatusHistory.leadId, leadId)).orderBy(desc(leadStatusHistory.createdAt));
}

export async function createLeadStatusHistory(history: InsertLeadStatusHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(leadStatusHistory).values(history);
}

// Settings queries
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSetting(setting: InsertSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(settings).values(setting).onDuplicateKeyUpdate({
    set: { value: setting.value, updatedAt: new Date() },
  });
}

// Statistics queries
export async function getLeadsStats() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    total: sql<number>`count(*)`,
    new: sql<number>`sum(case when status = 'new' then 1 else 0 end)`,
    contacted: sql<number>`sum(case when status = 'contacted' then 1 else 0 end)`,
    booked: sql<number>`sum(case when status = 'booked' then 1 else 0 end)`,
    notInterested: sql<number>`sum(case when status = 'not_interested' then 1 else 0 end)`,
    noAnswer: sql<number>`sum(case when status = 'no_answer' then 1 else 0 end)`,
  }).from(leads);
  
  return result[0];
}

export async function getCampaignStats(campaignId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    total: sql<number>`count(*)`,
    new: sql<number>`sum(case when status = 'new' then 1 else 0 end)`,
    contacted: sql<number>`sum(case when status = 'contacted' then 1 else 0 end)`,
    booked: sql<number>`sum(case when status = 'booked' then 1 else 0 end)`,
    notInterested: sql<number>`sum(case when status = 'not_interested' then 1 else 0 end)`,
    noAnswer: sql<number>`sum(case when status = 'no_answer' then 1 else 0 end)`,
  }).from(leads).where(eq(leads.campaignId, campaignId));
  
  return result[0];
}

// Doctors queries
export async function getAllDoctors() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(doctors).where(eq(doctors.available, "yes"));
  return result;
}

export async function getDoctorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(doctors).where(eq(doctors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Appointments queries
export async function createAppointment(appointment: InsertAppointment) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create appointment: database not available");
    return null;
  }

  try {
    await db.insert(appointments).values(appointment);
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to create appointment:", error);
    throw error;
  }
}

export async function getAllAppointments() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(appointments);
  return result;
}

export async function updateAppointmentStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update appointment: database not available");
    return;
  }

  try {
    await db.update(appointments).set({ status: status as any }).where(eq(appointments.id, id));
  } catch (error) {
    console.error("[Database] Failed to update appointment:", error);
    throw error;
  }
}
