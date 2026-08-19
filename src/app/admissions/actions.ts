"use server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const WRITE_TOKEN = process.env.STRAPI_WRITE_TOKEN;

export type EnrollmentState = {
  status: "idle" | "success" | "error";
  message?: string;
  submitted?: {
    fullName: string;
    email: string;
    phone: string;
    course?: string;
    documents?: { name: string; url: string }[];
  };
};

async function resolveCourseDocumentId(slug: string): Promise<string | undefined> {
  const res = await fetch(
    `${STRAPI_URL}/api/courses?filters[slug][$eq]=${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Bearer ${WRITE_TOKEN}` } },
  );
  if (!res.ok) return undefined;
  const json = await res.json();
  return json.data?.[0]?.documentId;
}

export async function submitEnrollment(
  _prevState: EnrollmentState,
  formData: FormData,
): Promise<EnrollmentState> {
  if (!WRITE_TOKEN) {
    return {
      status: "error",
      message: "Applications aren't wired up yet — please call or WhatsApp us directly.",
    };
  }

  // Honeypot: bots fill every field, including this hidden one. Return a
  // fake success so they don't learn the field was a trap.
  if (formData.get("company")) {
    return { status: "success" };
  }

  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const courseSlug = formData.get("course")?.toString() || undefined;
  const notes = formData.get("notes")?.toString().trim() || undefined;
  const files = formData
    .getAll("documents")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!fullName || !email || !phone) {
    return { status: "error", message: "Please fill in your name, email, and phone." };
  }

  try {
    let documentIds: number[] = [];
    let uploadedDocuments: { name: string; url: string }[] = [];
    if (files.length > 0) {
      const uploadForm = new FormData();
      for (const file of files) uploadForm.append("files", file, file.name);
      const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${WRITE_TOKEN}` },
        body: uploadForm,
      });
      if (!uploadRes.ok) {
        throw new Error(`Strapi upload failed: ${uploadRes.status}`);
      }
      const uploaded: { id: number; name: string; url: string }[] = await uploadRes.json();
      documentIds = uploaded.map((f) => f.id);
      uploadedDocuments = uploaded.map((f) => ({
        name: f.name,
        url: f.url.startsWith("http") ? f.url : `${STRAPI_URL}${f.url}`,
      }));
    }

    const courseInterest = courseSlug
      ? await resolveCourseDocumentId(courseSlug)
      : undefined;

    const createRes = await fetch(`${STRAPI_URL}/api/enrollment-applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WRITE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          fullName,
          email,
          phone,
          courseInterest,
          documents: documentIds,
          notes,
          submittedAt: new Date().toISOString(),
        },
      }),
    });
    if (!createRes.ok) {
      throw new Error(`Strapi enrollment-application create failed: ${createRes.status}`);
    }

    return {
      status: "success",
      submitted: {
        fullName,
        email,
        phone,
        course: courseSlug,
        documents: uploadedDocuments,
      },
    };
  } catch (err) {
    console.error("Enrollment submission failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending your application — please try again or contact us directly.",
    };
  }
}

export type BookingState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  if (!WRITE_TOKEN) {
    return {
      status: "error",
      message: "Booking requests aren't wired up yet — please call or WhatsApp us directly.",
    };
  }

  // Honeypot: bots fill every field, including this hidden one. Return a
  // fake success so they don't learn the field was a trap.
  if (formData.get("company")) {
    return { status: "success" };
  }

  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const courseSlug = formData.get("course")?.toString() || undefined;
  const preferredDate = formData.get("preferredDate")?.toString() || undefined;

  if (!name || !phone) {
    return { status: "error", message: "Please fill in your name and phone number." };
  }

  try {
    const courseInterest = courseSlug
      ? await resolveCourseDocumentId(courseSlug)
      : undefined;

    const createRes = await fetch(`${STRAPI_URL}/api/booking-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WRITE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name,
          phone,
          courseInterest,
          preferredDate: preferredDate || undefined,
          submittedAt: new Date().toISOString(),
        },
      }),
    });
    if (!createRes.ok) {
      throw new Error(`Strapi booking-request create failed: ${createRes.status}`);
    }

    return { status: "success" };
  } catch (err) {
    console.error("Booking submission failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending your booking — please try again or contact us directly.",
    };
  }
}
