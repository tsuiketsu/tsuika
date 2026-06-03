import { throwError } from "@/errors/handlers";
import { createRouter } from "@/lib/create-app";
import { createSources } from "@/openapi/helpers";
import { createLinkPreview } from "@/openapi/routes/util";
import { fetchLinkPreview } from "@/utils/link-preview";

const router = createRouter();
const sources = createSources("utils");

router.openapi(createLinkPreview, async (c) => {
  const url = c.req.query("url");

  if (!url || url.trim() === "" || !url.startsWith("http")) {
    throwError(
      "INVALID_PARAMETER",
      "URL is either missing or invalid",
      sources.get,
    );
  }

  const meta = await fetchLinkPreview(url);

  if (!meta.data || meta.status !== 200) {
    throwError("INTERNAL_ERROR", meta.message, sources.get);
  }

  return c.json(
    {
      success: true,
      message: meta.message,
      data: meta.data,
    },
    200,
  );
});

export default router;
