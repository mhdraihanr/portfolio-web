/**
 * Mencari record gambar yatim: baris database yang menyimpan `{url, fileId}`
 * tetapi file-nya sudah tidak ada di ImageKit.
 *
 * Terjadi kalau file dihapus langsung dari dashboard ImageKit — record di
 * Supabase tidak ikut terhapus, jadi gambar rusak di situs dan tombol hapus di
 * studio tidak ada gunanya.
 *
 * Pemakaian:
 *   pnpm audit:images             # hanya melaporkan (default, tidak mengubah apa pun)
 *   pnpm audit:images --apply     # membersihkan record yatim
 *
 * `--apply` sengaja butuh konfirmasi lewat env `CONFIRM_IMAGE_CLEANUP=yes`.
 */

import ImageKit from "@imagekit/nodejs";
import { createAdminClient } from "../lib/supabase/admin";
import type { Database } from "../types/database.types";

interface Orphan {
  table: string;
  rowId: string;
  label: string;
  column: string;
  url: string;
  fileId: string;
  kind: "array-item" | "single";
  arrayIndex?: number;
}

type ProjectImage = { url: string; fileId: string };

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

async function existsInImageKit(fileId: string): Promise<boolean> {
  try {
    await imagekit.files.get(fileId);
    return true;
  } catch {
    return false;
  }
}

function describeProject(row: { id: string; title: string | null }): string {
  return `project "${row.title ?? "untitled"}" (${row.id})`;
}

async function collectProjectOrphans(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<Orphan[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, images");

  if (error) throw error;

  const orphans: Orphan[] = [];

  for (const row of data ?? []) {
    const images = (row.images ?? []) as ProjectImage[];

    for (const [arrayIndex, image] of images.entries()) {
      if (!image?.fileId) continue;

      if (!(await existsInImageKit(image.fileId))) {
        orphans.push({
          table: "projects",
          rowId: row.id,
          label: describeProject(row),
          column: "images",
          url: image.url,
          fileId: image.fileId,
          kind: "array-item",
          arrayIndex,
        });
      }
    }
  }

  return orphans;
}

async function collectExperienceOrphans(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<Orphan[]> {
  const { data, error } = await supabase
    .from("work_experience")
    .select("id, company, logo_url, images");

  if (error) throw error;

  const orphans: Orphan[] = [];

  for (const row of data ?? []) {
    const label = `work_experience "${row.company ?? "untitled"}" (${row.id})`;
    const images = (row.images ?? []) as ProjectImage[];

    for (const [arrayIndex, image] of images.entries()) {
      if (!image?.fileId) continue;

      if (!(await existsInImageKit(image.fileId))) {
        orphans.push({
          table: "work_experience",
          rowId: row.id,
          label,
          column: "images",
          url: image.url,
          fileId: image.fileId,
          kind: "array-item",
          arrayIndex,
        });
      }
    }
  }

  return orphans;
}

/**
 * `logo_url` dan `photo_url` tidak menyimpan `fileId`, jadi keberadaannya hanya
 * bisa diuji dari URL-nya. Response 404 berarti file sudah tidak ada.
 */
async function urlIsGone(url: string): Promise<boolean> {
  if (!url.includes("ik.imagekit.io")) return false;

  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status === 404;
  } catch {
    // Masalah jaringan bukan bukti file hilang; jangan laporkan sebagai yatim.
    return false;
  }
}

async function collectSingleUrlOrphans(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<Orphan[]> {
  const orphans: Orphan[] = [];

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, title, image_url");

  if (projectError) throw projectError;

  for (const row of projects ?? []) {
    if (!row.image_url || !(await urlIsGone(row.image_url))) continue;

    orphans.push({
      table: "projects",
      rowId: row.id,
      label: describeProject(row),
      column: "image_url",
      url: row.image_url,
      fileId: "",
      kind: "single",
    });
  }

  const { data: experiences, error: experienceError } = await supabase
    .from("work_experience")
    .select("id, company, logo_url");

  if (experienceError) throw experienceError;

  for (const row of experiences ?? []) {
    if (!row.logo_url || !(await urlIsGone(row.logo_url))) continue;

    orphans.push({
      table: "work_experience",
      rowId: row.id,
      label: `work_experience "${row.company ?? "untitled"}" (${row.id})`,
      column: "logo_url",
      url: row.logo_url,
      fileId: "",
      kind: "single",
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("id, full_name, photo_url");

  if (profileError) throw profileError;

  for (const row of profile ?? []) {
    if (!row.photo_url || !(await urlIsGone(row.photo_url))) continue;

    orphans.push({
      table: "profile",
      rowId: String(row.id),
      label: `profile "${row.full_name ?? "untitled"}"`,
      column: "photo_url",
      url: row.photo_url,
      fileId: "",
      kind: "single",
    });
  }

  return orphans;
}

async function cleanArrayItems(
  supabase: ReturnType<typeof createAdminClient>,
  orphans: Orphan[],
): Promise<number> {
  let cleaned = 0;

  const grouped = new Map<string, Orphan[]>();

  for (const orphan of orphans.filter((o) => o.kind === "array-item")) {
    const key = `${orphan.table}:${orphan.rowId}`;
    grouped.set(key, [...(grouped.get(key) ?? []), orphan]);
  }

  for (const [, group] of grouped) {
    const { table, rowId, column } = group[0];
    const removeIndexes = group
      .map((o) => o.arrayIndex)
      .filter((i): i is number => i !== undefined);

    if (table === "projects") {
      const { data } = await supabase
        .from("projects")
        .select("images")
        .eq("id", rowId)
        .single();

      const kept = ((data?.images ?? []) as ProjectImage[]).filter(
        (_, index) => !removeIndexes.includes(index),
      );

      const { error } = await supabase
        .from("projects")
        .update({ images: kept })
        .eq("id", rowId);

      if (error) throw error;
    } else {
      const { data } = await supabase
        .from("work_experience")
        .select("images")
        .eq("id", rowId)
        .single();

      const kept = ((data?.images ?? []) as ProjectImage[]).filter(
        (_, index) => !removeIndexes.includes(index),
      );

      const { error } = await supabase
        .from("work_experience")
        .update({ images: kept })
        .eq("id", rowId);

      if (error) throw error;
    }

    cleaned += removeIndexes.length;
  }

  return cleaned;
}

async function cleanSingleUrls(
  supabase: ReturnType<typeof createAdminClient>,
  orphans: Orphan[],
): Promise<number> {
  let cleaned = 0;

  for (const orphan of orphans.filter((o) => o.kind === "single")) {
    const nullValue: Database["public"]["Tables"]["profile"]["Update"] = {
      [orphan.column]: null,
    };

    if (orphan.table === "projects") {
      const { error } = await supabase
        .from("projects")
        .update({ [orphan.column]: null })
        .eq("id", orphan.rowId);

      if (error) throw error;
    } else if (orphan.table === "work_experience") {
      const { error } = await supabase
        .from("work_experience")
        .update({ [orphan.column]: null })
        .eq("id", orphan.rowId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("profile")
        .update({ [orphan.column]: null })
        .eq("id", Number(orphan.rowId));

      if (error) throw error;
    }

    void nullValue;
    cleaned += 1;
  }

  return cleaned;
}

async function main() {
  const apply = process.argv.includes("--apply");

  if (apply && process.env.CONFIRM_IMAGE_CLEANUP !== "yes") {
    console.error(
      "Penghapusan dibatalkan. Set CONFIRM_IMAGE_CLEANUP=yes kalau memang mau membersihkan record yatim.",
    );
    process.exit(1);
  }

  const supabase = createAdminClient();

  console.log(
    "Memindai Project.images, Work_experience.images, dan URL tunggal...\n",
  );

  const arrayOrphans = [
    ...(await collectProjectOrphans(supabase)),
    ...(await collectExperienceOrphans(supabase)),
  ];
  const singleOrphans = await collectSingleUrlOrphans(supabase);
  const orphans = [...arrayOrphans, ...singleOrphans];

  if (orphans.length === 0) {
    console.log("Tidak ada record gambar yatim. Database bersih.");
    return;
  }

  console.log(`Ditemukan ${orphans.length} record yatim:\n`);

  for (const orphan of orphans) {
    console.log(`- ${orphan.label}`);
    console.log(`  kolom : ${orphan.column}`);
    console.log(`  url   : ${orphan.url}`);
    if (orphan.fileId) console.log(`  fileId: ${orphan.fileId}`);
    console.log("");
  }

  if (!apply) {
    console.log(
      "Mode laporan saja. Tidak ada yang diubah. Jalankan dengan --apply (dan CONFIRM_IMAGE_CLEANUP=yes) untuk membersihkan.",
    );
    return;
  }

  const cleanedArrayItems = await cleanArrayItems(supabase, arrayOrphans);
  const cleanedSingles = await cleanSingleUrls(supabase, singleOrphans);

  console.log(
    `Selesai. ${cleanedArrayItems} item array dihapus, ${cleanedSingles} URL tunggal dikosongkan.`,
  );
  console.log(
    "Cache situs belum diperbarui. Buka studio lalu simpan salah satu project, atau panggil POST /api/revalidate.",
  );
}

main().catch((error) => {
  console.error("Audit gagal:", error);
  process.exit(1);
});
