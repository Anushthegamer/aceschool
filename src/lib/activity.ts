import { supabase } from "@/integrations/supabase/client";

export async function logActivity(action: string, entity?: string, metadata?: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("activity_log").insert({
    user_id: user.id,
    action,
    entity: entity ?? null,
    metadata: metadata ?? {},
  });
}
