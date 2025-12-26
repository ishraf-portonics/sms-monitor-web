import { supabase } from "./supabase";

export interface SMS {
  id: string;
  msisdn: string;
  sender: string;
  message: string;
  received_at: string;
  created_at: string;
}

export interface SMSFilter {
  sender?: string;
  msisdn?: string;
  search?: string;
}

export const fetchSMS = async (
  limit: number = 50,
  offset: number = 0,
  filters?: SMSFilter
) => {
  try {
    let query = supabase
      .from("sms_messages")
      .select("*", { count: "exact" })
      .order("received_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters?.sender) {
      query = query.eq("sender", filters.sender);
    }

    if (filters?.msisdn) {
      query = query.eq("msisdn", filters.msisdn);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching SMS:", error.message);
      throw error;
    }

    return { data: (data as SMS[]) || [], count: count || 0 };
  } catch (err) {
    console.error("Failed to fetch SMS messages:", err);
    throw err;
  }
};

export const searchSMS = async (
  searchTerm: string,
  limit: number = 50,
  offset: number = 0,
  filters?: SMSFilter
) => {
  try {
    let query = supabase
      .from("sms_messages")
      .select("*", { count: "exact" })
      .order("received_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply text search on message content
    if (searchTerm) {
      query = query.ilike("message", `%${searchTerm}%`);
    }

    // Apply additional filters
    if (filters?.sender) {
      query = query.eq("sender", filters.sender);
    }

    if (filters?.msisdn) {
      query = query.eq("msisdn", filters.msisdn);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error searching SMS:", error.message);
      throw error;
    }

    return { data: (data as SMS[]) || [], count: count || 0 };
  } catch (err) {
    console.error("Failed to search SMS messages:", err);
    throw err;
  }
};

export const getUniqueSenders = async () => {
  try {
    const { data, error } = await supabase
      .from("sms_messages")
      .select("sender", { count: "exact" })
      .order("sender");

    if (error) {
      console.error("Error fetching senders:", error.message);
      throw error;
    }

    // Get unique senders
    const uniqueSenders = Array.from(
      new Set((data as any[])?.map((d) => d.sender) || [])
    );

    return uniqueSenders;
  } catch (err) {
    console.error("Failed to fetch unique senders:", err);
    throw err;
  }
};

export const getUniqueMSISDNs = async () => {
  try {
    const { data, error } = await supabase
      .from("sms_messages")
      .select("msisdn", { count: "exact" })
      .order("msisdn");

    if (error) {
      console.error("Error fetching MSISDNs:", error.message);
      throw error;
    }

    // Get unique MSISDNs
    const uniqueMSISDNs = Array.from(
      new Set((data as any[])?.map((d) => d.msisdn) || [])
    );

    return uniqueMSISDNs;
  } catch (err) {
    console.error("Failed to fetch unique MSISDNs:", err);
    throw err;
  }
};

export const getSendersForMSISDN = async (msisdn: string) => {
  try {
    const { data, error } = await supabase
      .from("sms_messages")
      .select("sender", { count: "exact" })
      .eq("msisdn", msisdn)
      .order("sender");

    if (error) {
      console.error("Error fetching senders for MSISDN:", error.message);
      throw error;
    }

    // Get unique senders for this MSISDN
    const uniqueSenders = Array.from(
      new Set((data as any[])?.map((d) => d.sender) || [])
    );

    return uniqueSenders;
  } catch (err) {
    console.error(`Failed to fetch senders for MSISDN ${msisdn}:`, err);
    throw err;
  }
};

export const fetchConversation = async (msisdn: string, sender: string) => {
  try {
    const { data, error } = await supabase
      .from("sms_messages")
      .select("*")
      .eq("msisdn", msisdn)
      .eq("sender", sender)
      .order("received_at", { ascending: false }); // Newest first for chat

    if (error) {
      console.error("Error fetching conversation:", error.message);
      throw error;
    }

    return (data as SMS[]) || [];
  } catch (err) {
    console.error("Failed to fetch conversation:", err);
    throw err;
  }
};
