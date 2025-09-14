import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/features/users/db/userResumes";

export const createAISummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { resumeFileUrl: true },
      });
    });

    if (userResume == null) return;

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash",
        apiKey: env.GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: await fetch(userResume.resumeFileUrl)
                    .then((res) => res.arrayBuffer())
                    .then((buf) => Buffer.from(buf).toString("base64")),
                  mimeType: "application/pdf",
                },
              },
              {
                text: "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
              },
            ],
          },
        ],
      },
    });

    await step.run("save-ai-summary", async () => {
      const candidate = result.candidates?.[0];
      if (!candidate) {
        return;
      }

      const textPart = candidate.content?.parts?.find(
        (part) =>
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
      );
      if (
        !textPart ||
        !(
          typeof textPart === "object" &&
          "text" in textPart &&
          typeof textPart.text === "string"
        )
      ) {
        return;
      }

      await updateUserResume(userId, { aiSummary: textPart.text });
    });
  }
);
