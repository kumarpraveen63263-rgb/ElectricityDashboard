import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { acknowledgeScopedAlert, createScopedTicket, getOrCreateEmployeeProfile, getScopedControlRoomRecords, getTechnicianTickets, updateTechnicianTicketStatus } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  employee: router({
    access: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getOrCreateEmployeeProfile(ctx.user);
      return { userId: ctx.user.id, coreRole: ctx.user.role, ...profile };
    }),
  }),
  controlRoom: router({
    scope: protectedProcedure.query(({ ctx }) => getScopedControlRoomRecords(ctx.user)),
    createTicket: protectedProcedure.input(z.object({ transformerId: z.number().int().positive(), title: z.string().min(3).max(200), description: z.string().max(4000).optional(), severity: z.enum(["watch", "high", "critical"]), dueAt: z.date().optional() })).mutation(({ ctx, input }) => createScopedTicket({ user: ctx.user, ...input })),
    acknowledgeAlert: protectedProcedure.input(z.object({ alertId: z.number().int().positive() })).mutation(({ ctx, input }) => acknowledgeScopedAlert({ user: ctx.user, ...input })),
  }),
  technician: router({
    myTickets: protectedProcedure.query(({ ctx }) => getTechnicianTickets(ctx.user.id)),
    updateTicketStatus: protectedProcedure
      .input(
        z.object({
          ticketId: z.number().int().positive(),
          status: z.enum(["open", "assigned", "in_progress", "resolved", "closed"]),
          note: z.string().min(1).max(2000),
        })
      )
      .mutation(({ ctx, input }) =>
        updateTechnicianTicketStatus({
          userId: ctx.user.id,
          ticketId: input.ticketId,
          status: input.status,
          note: input.note,
        })
      ),
  }),
});

export type AppRouter = typeof appRouter;
