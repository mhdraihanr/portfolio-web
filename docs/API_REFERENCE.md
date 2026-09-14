# API Reference

Dokumentasi lengkap untuk API endpoints yang tersedia di portfolio website.

## Base URL

**Development**: `http://localhost:3000/api`  
**Production**: `https://yourdomain.com/api`

---

## Authentication

### 🔐 Security Overview

**CRUD operations are protected by 3 security layers:**

1. **Middleware Protection** - Blocks unauthorized page access
2. **Row Level Security (RLS)** - Database-level protection
3. **Supabase Auth** - Token-based authentication

**Result:** Only authenticated admin users can Create/Update/Delete data.

### Public vs Protected Endpoints

**Public (No Auth Required):**

- ✅ `GET /api/projects` - Read all projects
- ✅ `GET /api/projects/[slug]` - Read single project
- ✅ `GET /api/experience` - Read all experience
- ✅ `GET /api/experience/[id]` - Read single experience
- ✅ `POST /api/contact` - Send contact form

**Protected (Auth Required):**

- 🔒 `POST /api/projects` - Create project
- 🔒 `PUT /api/projects/[id]` - Update project
- 🔒 `DELETE /api/projects/[id]` - Delete project
- 🔒 `POST /api/experience` - Create experience
- 🔒 `PUT /api/experience/[id]` - Update experience
- 🔒 `DELETE /api/experience/[id]` - Delete experience

**Note:** Your admin panel already handles authentication automatically. Manual API calls require auth headers.

**Headers Required for Protected Endpoints:**

```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

Token didapat dari Supabase Auth session setelah login.

**Security Details:** See [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) for complete security documentation.

---

## Endpoints

### 1. Contact Form

Send email dari contact form.

**Endpoint:** `POST /api/contact`

**Authentication:** None (Public)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I would like to discuss a project..."
}
```

**Validation:**

- `name`: Required, min 2 characters, max 100 characters
- `email`: Required, valid email format
- `message`: Required, min 10 characters, max 1000 characters

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Validation error message"
}
```

**Error Response (500):**

```json
{
  "success": false,
  "error": "Failed to send email"
}
```

---

### 2. ImageKit (Image Management)

API endpoints untuk upload dan delete gambar via ImageKit.io CDN.

#### Upload Image

Upload satu gambar ke folder `/portfolio` ImageKit. File dikirim ke server, divalidasi, baru diteruskan ke ImageKit memakai private key — kunci tidak pernah sampai ke browser.

**Endpoint:** `POST /api/imagekit-upload`

**Authentication:** Required (Supabase session)

**Request Body:** `multipart/form-data`

| Field  | Type | Required | Keterangan                            |
| ------ | ---- | -------- | ------------------------------------- |
| `file` | File | Ya       | JPEG, PNG, WebP, atau AVIF. Maks 5MB. |

**Success Response (200):**

```json
{
  "url": "https://ik.imagekit.io/xxxxx/portfolio/nama-file.jpg",
  "fileId": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "filePath": "/portfolio/nama-file.jpg",
  "mime": "image/jpeg"
}
```

**Error Responses:**

| Status | Penyebab                                              |
| ------ | ----------------------------------------------------- |
| `400`  | Field `file` tidak ada, atau file kosong              |
| `401`  | Tidak ada session admin                               |
| `413`  | Ukuran file melebihi 5MB                              |
| `415`  | Magic bytes bukan JPEG/PNG/WebP/AVIF                  |
| `500`  | ImageKit menolak upload (termasuk kegagalan `checks`) |

---

#### Delete Image

Delete image from ImageKit CDN by fileId. Hanya file di dalam folder `/portfolio` yang boleh dihapus.

**Endpoint:** `POST /api/imagekit-delete`

**Authentication:** Required (Supabase session)

**Request Body:**

```json
{
  "fileId": "xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Success Response (200):**

```json
{
  "success": true
}
```

**Error Responses:**

| Status | Penyebab                                |
| ------ | --------------------------------------- |
| `400`  | `fileId` tidak ada atau bukan string    |
| `401`  | Tidak ada session admin                 |
| `403`  | File berada di luar folder `/portfolio` |
| `500`  | ImageKit gagal menghapus file           |

**Idempotent:** kalau file sudah tidak ada di ImageKit (misalnya dihapus langsung dari dashboard), endpoint membalas `200` dengan `{ "success": true, "alreadyDeleted": true }` alih-alih `500`. Tanpa ini, baris database yang menunjuk ke file tersebut tidak akan pernah bisa dibersihkan dari studio.

**Note:** `fileId` is returned by ImageKit during upload and stored with images in database.

---

### 3. Projects

#### Get All Projects

**Endpoint:** `GET /api/projects`

**Authentication:** None (Public)

**Query Parameters:**

- `featured` (optional): `true` | `false` - Filter featured projects only
- `limit` (optional): Number - Limit results
- `offset` (optional): Number - Offset for pagination

**Example:**

```
GET /api/projects?featured=true&limit=6
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Employee Management System",
      "slug": "employee-management-system",
      "description": "Platform terpusat untuk mengelola data karyawan...",
      "problem": "Proses cuti, lembur...",
      "solution": "Membangun platform terpusat...",
      "impact": "Proses approval jadi lebih terstruktur...",
      "technologies": ["Next.js", "TypeScript", "PostgreSQL"],
      "image_url": "https://...",
      "project_url": "https://...",
      "github_url": "https://...",
      "featured": true,
      "order_index": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 10
}
```

#### Get Single Project

**Endpoint:** `GET /api/projects/[slug]`

**Authentication:** None (Public)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Employee Management System"
    // ... full project data
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Project not found"
}
```

#### Create Project

**Endpoint:** `POST /api/projects`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "title": "New Project",
  "slug": "new-project",
  "description": "Project description",
  "technologies": [
    {
      "name": "Next.js",
      "icon": "devicon-nextjs-plain",
      "icon_svg": "https://..."
    }
  ],
  "images": [{ "url": "https://...", "fileId": "..." }],
  "image_url": "https://...",
  "project_url": "https://...",
  "github_url": "https://...",
  "featured": false,
  "order_index": 1
}
```

**Validation:**

- `title`: Required, min 3 characters, max 100 characters
- `slug`: Required, unique, URL-safe format
- `description`: Required, min 10 characters, max 500 characters
- `technologies`: Required, array of `{ name, icon, icon_svg }`, min 1 item, max 20
- `images`: Optional, array of `{ url, fileId }`, max 10 items
- `image_url`: Optional, valid URL
- `project_url`: Optional, valid URL
- `github_url`: Optional, valid URL
- `featured`: Optional, boolean
- `order_index`: Optional, number

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Project"
    // ... full project data
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Validation error message"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Error Response (409):**

```json
{
  "success": false,
  "error": "Project with this slug already exists"
}
```

#### Update Project

**Endpoint:** `PUT /api/projects/[id]`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "title": "Updated Project Title",
  "description": "Updated description"
  // ... other fields to update
}
```

**Note:** Only include fields you want to update. Partial updates are supported.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid"
    // ... updated project data
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Project not found"
}
```

#### Delete Project

**Endpoint:** `DELETE /api/projects/[id]`

**Authentication:** Required (Admin only)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Project not found"
}
```

---

### 3. Work Experience

#### Get All Experience

**Endpoint:** `GET /api/experience`

**Authentication:** None (Public)

**Query Parameters:**

- `current` (optional): `true` | `false` - Filter current positions only
- `limit` (optional): Number - Limit results
- `offset` (optional): Number - Offset for pagination

**Example:**

```
GET /api/experience?current=true
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company": "PT. Manufacturing Company",
      "position": "Fullstack Web Developer",
      "description": "Membangun dan maintain internal tools...",
      "start_date": "2023-01-01",
      "end_date": null,
      "is_current": true,
      "order_index": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 5
}
```

#### Get Single Experience

**Endpoint:** `GET /api/experience/[id]`

**Authentication:** None (Public)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "PT. Manufacturing Company"
    // ... full experience data
  }
}
```

#### Create Experience

**Endpoint:** `POST /api/experience`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "company": "Company Name",
  "position": "Job Title",
  "description": "Job description and responsibilities",
  "start_date": "2023-01-01",
  "end_date": "2024-01-01",
  "is_current": false,
  "order_index": 1
}
```

**Validation:**

- `company`: Required, min 2 characters, max 200 characters
- `position`: Required, min 2 characters, max 200 characters
- `description`: Required, min 10 characters
- `start_date`: Required, valid date (YYYY-MM-DD)
- `end_date`: Optional, valid date, must be after start_date
- `is_current`: Optional, boolean
- `order_index`: Optional, number

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid"
    // ... full experience data
  }
}
```

#### Update Experience

**Endpoint:** `PUT /api/experience/[id]`

**Authentication:** Required (Admin only)

**Request Body:** Same as create, but all fields optional

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid"
    // ... updated experience data
  }
}
```

#### Delete Experience

**Endpoint:** `DELETE /api/experience/[id]`

**Authentication:** Required (Admin only)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Experience deleted successfully"
}
```

---

### 4. Skills (Direct Supabase Client)

Skills CRUD operations are performed via **direct Supabase client calls** from admin pages (not API routes). Data is accessed through helper functions in `lib/supabase/helpers.ts`.

#### Database Table: `public.skills`

```sql
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'tools', 'others')),
    icon TEXT,           -- Devicon class (e.g., "devicon-react-original colored")
    icon_svg TEXT,        -- SVG URL for icon preview
    order_index INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Helper Functions

- `insertSkill(supabase, data)` - Create new skill
- `updateSkill(supabase, id, data)` - Update skill by ID
- `deleteSkill(supabase, id)` - Delete skill by ID

#### Public Data Access (Homepage)

The About section fetches visible skills directly:

```typescript
const { data } = await supabase
  .from("skills")
  .select("name, icon, icon_svg, category")
  .eq("is_visible", true)
  .order("order_index", { ascending: true });
```

#### Studio Pages

- **List:** `/studio/skills` - Grid/Table view with search & category filter
- **Create:** `/studio/skills/new` - Form with Devicon Icon Picker
- **Edit:** `/studio/skills/[id]/edit` - Pre-filled form with update & delete

---

### 6. Cache Revalidation

Revalidate Next.js cache tags and paths on-demand.

**Endpoint:** `POST /api/revalidate`

**Authentication:** Required (Authenticated user session)

**Request Body:**

```json
{
  "tag": "homepage-certificates",
  "path": "/"
}
```

**Cache Tags Supported:**

- `homepage-skills`
- `homepage-projects`
- `homepage-experience`
- `homepage-certificates`
- `all-projects`
- `project-[slug]`

**Success Response (200):**

```json
{
  "revalidated": true,
  "now": 1716500000000
}
```

**Error Response (401):**

```json
{
  "error": "Unauthorized"
}
```

---

## Error Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 200  | Success                          |
| 201  | Created                          |
| 400  | Bad Request (Validation Error)   |
| 401  | Unauthorized (Not authenticated) |
| 403  | Forbidden (Not authorized)       |
| 404  | Not Found                        |
| 409  | Conflict (Duplicate entry)       |
| 500  | Internal Server Error            |

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production:

- Contact form: 5 requests per hour per IP
- Public API: 100 requests per minute per IP
- Admin API: 1000 requests per minute per user

---

## CORS

CORS is enabled for all origins in development.

In production, configure allowed origins in `next.config.ts`:

```ts
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ]
}
```

---

## Example Usage

### JavaScript/TypeScript

```typescript
// Get all projects
const response = await fetch("/api/projects");
const { data, count } = await response.json();

// Get featured projects only
const featuredResponse = await fetch("/api/projects?featured=true");
const { data: featuredProjects } = await featuredResponse.json();

// Send contact form
const contactResponse = await fetch("/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello!",
  }),
});
const result = await contactResponse.json();

// Create project (authenticated)
const createResponse = await fetch("/api/projects", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: "New Project",
    slug: "new-project",
    // ... other fields
  }),
});
```

### cURL

```bash
# Get all projects
curl https://yourdomain.com/api/projects

# Get featured projects
curl https://yourdomain.com/api/projects?featured=true

# Send contact form
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  }'

# Create project (authenticated)
curl -X POST https://yourdomain.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "description": "Description",
    "problem": "Problem",
    "solution": "Solution",
    "impact": "Impact",
    "technologies": ["Next.js"]
  }'
```

---

## Webhooks (Future)

Planned webhooks for future implementation:

- `project.created` - Triggered when new project is created
- `project.updated` - Triggered when project is updated
- `project.deleted` - Triggered when project is deleted
- `contact.submitted` - Triggered when contact form is submitted

---

## Changelog

### v1.2.0 (February 9, 2026)

- **ImageKit Integration** - Image upload and delete via CDN
  - `POST /api/imagekit-upload` - Upload image (auth required)
  - `POST /api/imagekit-delete` - Delete image by fileId (auth required)
- **ImageUploader Component** - Drag & drop with preview and delete
- **ImageCarousel Component** - Responsive slider with swipe/keyboard navigation
- Project images now stored as `{url, fileId}[]` for deletion support

### v1.1.0 (February 2026)

- Skills management via direct Supabase client (no API routes)
- Skills database table with categories, Devicon icons, visibility control
- Devicon Icon Picker component for admin panel

### v1.0.0 (2024-01-01)

- Initial API release
- Projects CRUD endpoints
- Work Experience CRUD endpoints
- Contact form endpoint

---

**Last Updated:** February 9, 2026
