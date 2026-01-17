import { DEFAULT_PAGE } from "@/constants";
import { meetingStatuses } from "@/drizzle/schema";
import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

export const filterSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum([...meetingStatuses])
    .withOptions({ clearOnDefault: true }),
  agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
