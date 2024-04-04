import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        orderID: z.string(),
        orderUser: z.string(),
        // orderFood: z.string(),
        orderCity: z.string(),
        // orderRating: z.number(),
        // orderReview: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.order.create({
        data: {
          order_id: input?.orderID,
          order_user: input?.orderUser,
          // order_food: input?.orderFood,
          order_city: input?.orderCity,
          // order_rating: input?.orderRating,
          // order_review: input?.orderReview,
        },
      })
      return prisma.order.findMany()
    }),

  read: publicProcedure
    .input(
      z
        .object({
          id: z.number().optional(),
          cuttingEdgeID: z.string().optional(),
          orderUser: z.string().optional(),
          // orderFood: z.string().optional(),
          orderCity: z.string().optional(),
          orderRating: z.number().optional(),
          orderReview: z.string().optional(),
          orderLat: z.number().optional(),
          orderLng: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx: { prisma }, input }) => {
      return prisma.order.findMany({
        where: {
          id: input?.id != null ? input?.id : undefined,
          order_id:
            input?.cuttingEdgeID != null ? input?.cuttingEdgeID : undefined,
          order_user: input?.orderUser != null ? input?.orderUser : undefined,
          // order_food: input?.orderFood != null ? input?.orderFood : undefined,
          order_city:
            input?.orderCity != null ? input?.orderCity : undefined,
          order_rating:
            input?.orderRating != null ? input?.orderRating : undefined,
          order_review:
            input?.orderReview != null ? input?.orderReview : undefined,
          order_lat: input?.orderLat != null ? input?.orderLat : undefined,
          order_lng: input?.orderLng != null ? input?.orderLng : undefined,
        },
      })
    }),

  update: publicProcedure
    .input(
      z.object({
        select: z.object({
          id: z.number().optional(),
          orderID: z.string(),
        }),
        update: z.object({
          orderUser: z.string().optional(),
          // orderFood: z.string().optional(),
          orderCity: z.string().optional(),
          orderRating: z.number().optional(),
          orderReview: z.string().optional(),
          orderLat: z.number().optional(),
          orderLng: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.order.update({
        where: {
          id: input?.select.id ? input?.select.id : undefined,
          order_id: input?.select.orderID,
        },
        data: {
          order_user:
            input?.update.orderUser != null ? input?.update.orderUser : undefined,
          // order_food:
            // input?.update.orderFood != null ? input?.update.orderFood : undefined,
          order_city:
            input?.update.orderCity != null
              ? input?.update.orderCity
              : undefined,
          order_rating:
            input?.update.orderRating != null
              ? input?.update.orderRating
              : undefined,
          order_review:
            input?.update.orderReview != null
              ? input?.update.orderReview
              : undefined,
          order_lat:
            input?.update.orderLat != null ? input?.update.orderLat : undefined,
          order_lng:
            input?.update.orderLng != null ? input?.update.orderLng : undefined,
        },
      })
      return prisma.order.findMany()
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        orderID: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.order.delete({
        where: {
          id: input?.id ? input?.id : undefined,
          order_id: input?.orderID,
        },
      })
      return prisma.order.findMany()
    }),
});
