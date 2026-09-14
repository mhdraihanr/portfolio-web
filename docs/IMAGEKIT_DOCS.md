# 🖼️ ImageKit Integration

Dokumentasi lengkap tentang integrasi ImageKit.io untuk upload dan management gambar.

---

## 📋 Overview

ImageKit.io digunakan sebagai CDN dan image management solution untuk:

- **Project Images** - Multiple images per project dengan carousel display
- **Experience Logo** - Company logo untuk work experience
- **Optimized Delivery** - Automatic image optimization dan CDN caching

---

## 🔧 Configuration

### Environment Variables

Tambahkan ke `.env.local`:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Dependencies

```bash
pnpm add @imagekit/nodejs
```

**Version:** `@imagekit/nodejs` ^7.3.0

---

## 🏗️ Architecture

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  ImageUploader  │────>│ /api/imagekit-  │────>│   ImageKit.io   │
│   Component     │     │     auth        │     │      CDN        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        ▼                                               ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Parent Form    │<────│   {url, fileId} │<────│  Upload Response│
│    State        │     │     returned    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        │  Delete Request
        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ /api/imagekit-  │────>│ imagekit.files  │────>│  File Deleted   │
│     delete      │     │    .delete()    │     │   from CDN      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### File Structure

```
app/
├── api/
│   ├── imagekit-upload/
│   │   └── route.ts        # POST - Upload endpoint (validated, server-side)
│   └── imagekit-delete/
│       └── route.ts        # POST - Delete image endpoint (scoped to /portfolio)

components/
└── ui/
    ├── image-uploader.tsx  # Upload component with preview & delete
    └── image-carousel.tsx  # Display carousel for multiple images

types/
└── project.ts              # ProjectImage interface
```

---

## 📁 API Routes

### POST `/api/imagekit-upload`

Upload gambar ke folder `/portfolio`. Browser mengirim file ke route ini; route memvalidasi (session admin, ukuran, magic bytes) lalu meneruskan ke ImageKit memakai private key. Kunci tidak pernah sampai ke client.

**Request:** `multipart/form-data` dengan field `file`.

**Response:**

```json
{
  "url": "https://ik.imagekit.io/xxxxx/portfolio/nama-file.jpg",
  "fileId": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "filePath": "/portfolio/nama-file.jpg",
  "mime": "image/jpeg"
}
```

**Implementation:**

```typescript
// app/api/imagekit-upload/route.ts
import ImageKit from "@imagekit/nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const PORTFOLIO_FOLDER = "/portfolio";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const uploaded = await imagekit.files.upload({
    file: await file.arrayBuffer(),
    fileName: file.name,
    folder: PORTFOLIO_FOLDER,
    checks: '"file.mime" : image AND "file.size" <= 5242880',
  });

  return NextResponse.json({
    url: uploaded.url,
    fileId: uploaded.fileId,
    filePath: uploaded.filePath,
  });
}
```

---

### POST `/api/imagekit-delete`

Delete image from ImageKit CDN.

**Request Body:**

```json
{
  "fileId": "xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (Success):**

```json
{
  "success": true
}
```

**Response (Error):**

```json
{
  "error": "Failed to delete image"
}
```

**Implementation:**

```typescript
// app/api/imagekit-delete/route.ts
import ImageKit from "@imagekit/nodejs";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 },
      );
    }

    await imagekit.files.delete(fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
```

---

## 🧩 Components

### ImageUploader Component

Upload component with drag & drop, preview, and delete functionality.

**Location:** `components/ui/image-uploader.tsx`

**Props:**

```typescript
interface ImageUploaderProps {
  onUploadComplete: (images: UploadedImage[]) => void;
  onDelete?: (image: UploadedImage, index: number) => void;
  maxImages?: number; // default: 10
  currentImages?: UploadedImage[];
  folder?: string; // default: "portfolio"
}

interface UploadedImage {
  url: string;
  fileId: string;
}
```

**Features:**

- ✅ Drag & drop file selection
- ✅ Click to browse files
- ✅ Multiple image support
- ✅ Progress indicator during upload
- ✅ Preview grid with thumbnails
- ✅ Delete button on hover (Trash2 icon)
- ✅ Loading state during deletion
- ✅ Max images limit (default: 10)
- ✅ Tracks fileId for deletion capability

**Usage:**

```tsx
import { ImageUploader, UploadedImage } from "@/components/ui";

function ProjectForm() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleUpload = (newImages: UploadedImage[]) => {
    setImages([...images, ...newImages]);
  };

  const handleDelete = async (image: UploadedImage, index: number) => {
    // Delete from ImageKit
    await fetch("/api/imagekit-delete", {
      method: "POST",
      body: JSON.stringify({ fileId: image.fileId }),
    });
    // Remove from state
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <ImageUploader
      currentImages={images}
      onUploadComplete={handleUpload}
      onDelete={handleDelete}
      maxImages={10}
    />
  );
}
```

---

### ImageCarousel Component

Responsive carousel/slider for displaying multiple images.

**Location:** `components/ui/image-carousel.tsx`

**Props:**

```typescript
interface ImageCarouselProps {
  images: Array<string | { url: string; fileId: string }>;
  alt: string;
  className?: string;
}
```

**Features:**

- ✅ Touch/swipe support for mobile (left/right gestures)
- ✅ Keyboard navigation (Arrow Left/Right keys)
- ✅ Thumbnail indicators with active state highlighting
- ✅ Image counter badge (X / Total)
- ✅ Navigation buttons (hover reveal on desktop, always visible on mobile)
- ✅ Single image: renders without carousel controls
- ✅ Backwards compatible: supports `string[]` and `{url, fileId}[]` formats
- ✅ Responsive sizing (smaller thumbnails on mobile)
- ✅ Wraparound navigation (last → first, first → last)

**Usage:**

```tsx
import { ImageCarousel } from "@/components/ui";

function ProjectDetail({ project }) {
  return (
    <ImageCarousel
      images={project.images}
      alt={project.title}
      className="mb-8"
    />
  );
}
```

**Behavior:**

| Image Count | Display Behavior                       |
| ----------- | -------------------------------------- |
| 0           | Returns `null` (nothing rendered)      |
| 1           | Single image without carousel controls |
| 2+          | Full carousel with navigation & thumbs |

---

## 📊 Type Definitions

### ProjectImage

```typescript
// types/project.ts
export interface ProjectImage {
  url: string;
  fileId: string;
}

export interface ProjectFormData {
  // ... other fields
  images: ProjectImage[]; // Changed from string[]
}
```

### Database Types

```typescript
// types/database.types.ts
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          // ... other fields
          images: { url: string; fileId: string }[];
        };
        Insert: {
          images?: { url: string; fileId: string }[];
        };
        Update: {
          images?: { url: string; fileId: string }[];
        };
      };
    };
  };
}
```

### Validation Schema

```typescript
// lib/validations/project.ts
import { z } from "zod";

export const projectImageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  fileId: z.string().min(1, "File ID is required"),
});

export const projectSchema = z.object({
  // ... other fields
  images: z
    .array(projectImageSchema)
    .max(10, "Maximum 10 images allowed")
    .optional()
    .default([]),
});
```

---

## 🔒 Security

### Authentication Flow

1. Client POST file ke `/api/imagekit-upload` (session admin wajib)
2. Route memvalidasi session, ukuran, dan magic bytes file
3. Route upload ke ImageKit memakai private key — kunci tidak pernah keluar dari server
4. Delete hanya melayani file di dalam `/portfolio` (dicek via `files.get` sebelum hapus)

### Best Practices

- ✅ Private key stored in environment variables only
- ✅ Upload lewat server route, bukan signed upload langsung dari browser
- ✅ Format diverifikasi dari magic bytes, bukan `Content-Type` kiriman client
- ✅ `checks` ImageKit menegakkan `file.mime: image` + `file.size` di sisi ImageKit
- ✅ Delete endpoint scoped ke folder `/portfolio`
- ✅ CSP (`Content-Security-Policy`) in `next.config.ts` allows `https://ik.imagekit.io` in `img-src`/`connect-src`

### Kenapa server-side upload

Pendekatan lama membagikan `token` + `signature` ke browser, dan signature itu bisa dipakai untuk upload dari folder mana pun. Dengan route server, private key tetap di server dan setiap upload melewati validasi kita dulu. Efek sampingnya `https://upload.imagekit.io` tidak lagi dibutuhkan di CSP `connect-src`.

---

## 📱 Usage in Admin Panel

### Projects Form (Multiple Images)

```tsx
// app/admin/projects/new/page.tsx
const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

<ImageUploader
  currentImages={uploadedImages}
  onUploadComplete={(images) => {
    setUploadedImages([...uploadedImages, ...images]);
  }}
  onDelete={async (image, index) => {
    await fetch("/api/imagekit-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: image.fileId }),
    });
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  }}
  maxImages={10}
/>;
```

### Experience Form (Single Logo)

```tsx
// app/admin/experience/new/page.tsx
const [uploadedLogo, setUploadedLogo] = useState<UploadedImage | null>(null);

<ImageUploader
  currentImages={uploadedLogo ? [uploadedLogo] : []}
  onUploadComplete={(images) => {
    setUploadedLogo(images[0]);
  }}
  onDelete={async () => {
    if (uploadedLogo) {
      await fetch("/api/imagekit-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: uploadedLogo.fileId }),
      });
      setUploadedLogo(null);
    }
  }}
  maxImages={1}
/>;
```

---

## 🎨 Public Display

### Project Detail Page

```tsx
// app/projects/[slug]/page.tsx
import { ImageCarousel } from "@/components/ui";

export default function ProjectPage({ project }) {
  return (
    <article>
      {/* Carousel for multiple images */}
      {project.images && project.images.length > 0 ? (
        <ImageCarousel images={project.images} alt={project.title} />
      ) : (
        project.image_url && (
          <Image src={project.image_url} alt={project.title} />
        )
      )}
    </article>
  );
}
```

### Project Listing (First Image)

```tsx
// app/(public)/components/projects.tsx (Homepage)
// app/projects/page.tsx (All Projects Page)
const getImageUrl = (project) => {
  if (project.images && project.images.length > 0) {
    const firstImage = project.images[0];
    return typeof firstImage === "string" ? firstImage : firstImage.url;
  }
  return project.image_url;
};
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Upload fails with authentication error**

- Check `IMAGEKIT_PRIVATE_KEY` is correct
- Verify key has upload permissions in ImageKit dashboard

**2. Delete fails with 404**

- Ensure `fileId` is the ImageKit file ID (not URL)
- Check file wasn't already deleted

**3. Images show as broken**

- Verify `IMAGEKIT_URL_ENDPOINT` matches your ImageKit account
- Check image exists in ImageKit Media Library

**4. CORS errors on upload**

- Add your domain to ImageKit dashboard whitelist
- Check API route returns proper headers

---

## 📚 Resources

- [ImageKit Documentation](https://docs.imagekit.io/)
- [ImageKit Node.js SDK](https://github.com/imagekit-developer/imagekit-nodejs)
- [ImageKit Dashboard](https://imagekit.io/dashboard)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Last Updated:** February 9, 2026
