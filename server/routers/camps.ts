/**
 * Camps Router
 * جهاز التوجيه الخاص بالمخيمات الطبية
 * 
 * Handles all tRPC procedures related to medical camps management
 * يتعامل مع جميع إجراءات tRPC المتعلقة بإدارة المخيمات الطبية
 */

import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { camps } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug, isValidSlug } from '../../shared/_core/utils/slug';

/**
 * Validation schema for creating/updating camps
 * مخطط التحقق من صحة البيانات لإنشاء/تحديث المخيمات
 */
const campInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const campsRouter = router({
  /**
   * Get all active camps
   * الحصول على جميع المخيمات النشطة
   */
  getAll: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const allCamps = await db
        .select()
        .from(camps)
        .where(eq(camps.isActive, true))
        .orderBy(camps.createdAt);

      return allCamps;
    } catch (error) {
      console.error('Error fetching camps:', error);
      throw new Error('Failed to fetch camps');
    }
  }),

  /**
   * Get a specific camp by slug
   * الحصول على مخيم معين حسب الرابط
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const camp = await db
          .select()
          .from(camps)
          .where(and(eq(camps.slug, input.slug), eq(camps.isActive, true)))
          .limit(1);

        if (camp.length === 0) {
          throw new Error('Camp not found');
        }

        return camp[0];
      } catch (error) {
        console.error('Error fetching camp:', error);
        throw new Error('Failed to fetch camp');
      }
    }),

  /**
   * Create a new camp (admin only)
   * إنشاء مخيم جديد (مسؤول فقط)
   */
  create: protectedProcedure
    .input(campInputSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify user is admin
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can create camps');
      }

      try {
        // Generate slug from name
        const slug = generateSlug(input.name);

        // Validate slug
        if (!isValidSlug(slug)) {
          throw new Error('Invalid slug format');
        }

        // Check if slug already exists
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const existingCamp = await db
          .select()
          .from(camps)
          .where(eq(camps.slug, slug))
          .limit(1);

        if (existingCamp.length > 0) {
          throw new Error('A camp with this name already exists');
        }

        // Create the camp
        const newCamp = await db.insert(camps).values({
          name: input.name,
          slug,
          description: input.description,
          imageUrl: input.imageUrl,
          startDate: input.startDate,
          endDate: input.endDate,
          isActive: true,
        });

        return { success: true, slug };
      } catch (error) {
        console.error('Error creating camp:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create camp');
      }
    }),

  /**
   * Update an existing camp (admin only)
   * تحديث مخيم موجود (مسؤول فقط)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...campInputSchema.shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user is admin
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can update camps');
      }

      try {
        // Generate new slug if name changed
        const slug = generateSlug(input.name);

        // Validate slug
        if (!isValidSlug(slug)) {
          throw new Error('Invalid slug format');
        }

        // Update the camp
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db
          .update(camps)
          .set({
            name: input.name,
            slug,
            description: input.description,
            imageUrl: input.imageUrl,
            startDate: input.startDate,
            endDate: input.endDate,
          })
          .where(eq(camps.id, input.id));

        return { success: true };
      } catch (error) {
        console.error('Error updating camp:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update camp');
      }
    }),

  /**
   * Deactivate a camp (admin only)
   * إلغاء تفعيل مخيم (مسؤول فقط)
   */
  deactivate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify user is admin
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can deactivate camps');
      }

      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db
          .update(camps)
          .set({ isActive: false })
          .where(eq(camps.id, input.id));

        return { success: true };
      } catch (error) {
        console.error('Error deactivating camp:', error);
        throw new Error('Failed to deactivate camp');
      }
    }),

  /**
   * Delete a camp (admin only)
   * حذف مخيم (مسؤول فقط)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify user is admin
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can delete camps');
      }

      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db.delete(camps).where(eq(camps.id, input.id));

        return { success: true };
      } catch (error) {
        console.error('Error deleting camp:', error);
        throw new Error('Failed to delete camp');
      }
    }),
});
