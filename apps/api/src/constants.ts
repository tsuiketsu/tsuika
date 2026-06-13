export const DEFAULT_QUERY_LIMIT = 10;
export const MAX_QUERY_LIMIT = 100;
export const INVALID_CHARS = /[/\\?%*:|"<>.]/;
export const UPLOADS_DIR = "./data/uploads";
export const PUBLIC_BUCKET = "tsuika";
export const trustedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.CORS_ORIGIN_BROWSER_EXTENSION,
  process.env.CORS_ORIGIN_HOPPSCOTCH,
];
export const ALLOWED_METHODS = [
  "POST",
  "GET",
  "PUT",
  "PATCH",
  "OPTIONS",
  "DELETE",
] as const;
export const ORDER_TYPES = ["asc", "desc"];
export const BOOKMARK_FILTERS = [
  "pinned",
  "archived",
  "favorites",
  "unsorted",
  "encrypted",
];
export const RESERVED_USERNAMES = [
  // 🔒 Admin/System Roles
  "admin",
  "administrator",
  "ceo",
  "dev",
  "developer",
  "founder",
  "manager",
  "mod",
  "moderator",
  "owner",
  "root",
  "staff",
  "superuser",
  "team",

  // 🛡 Security & Email-like Names
  "contact",
  "help",
  "info",
  "noreply",
  "official",
  "security",
  "service",
  "support",
  "support_team",
  "webmaster",

  // 🌐 Common Web Routes / Pages
  "account",
  "auth",
  "callback",
  "dashboard",
  "download",
  "explore",
  "feed",
  "home",
  "inbox",
  "index",
  "login",
  "logout",
  "messages",
  "notifications",
  "outbox",
  "profile",
  "register",
  "report",
  "search",
  "settings",
  "share",
  "signin",
  "signup",
  "upload",
  "verify",

  // ⚙ HTTP/CRUD Terms
  "create",
  "delete",
  "edit",
  "new",
  "update",

  // 📄 Legal/Meta Pages
  "about",
  "api",
  "blog",
  "cookie",
  "docs",
  "legal",
  "media",
  "news",
  "privacy",
  "status",
  "terms",

  // 🧑 Generic / System Terms
  "anonymous",
  "config",
  "console",
  "guest",
  "me",
  "system",
  "test",
  "user",
  "users",
  "you",

  // 🌀 Special Values / Edge Cases
  "false",
  "god",
  "null",
  "superman",
  "true",
  "undefined",

  // 🏷 Brand Terms (customize for your app)
  "enterprise",
  "free",
  "premium",
  "pro",
  "yourapp",
  "yourappteam",

  // 📁 App-specific entities (adjust to your domain model)
  "bookmark",
  "bookmarks",
  "collection",
  "collections",
  "folder",
  "folders",
  "share",
  "shared",
  "tag",
  "tags",
  "tsuika",
  "tsuika-api",
];
