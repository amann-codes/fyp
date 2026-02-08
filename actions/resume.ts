"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function parseResumeAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert resume parser. Analyze the attached PDF and extract information into strict JSON.
      
      CRITICAL INSTRUCTIONS:
      1. Bio: If missing, generate a 3-sentence professional bio.
      2. Projects: Extract project titles, descriptions, and any links (GitHub, Live demo).
      3. Education: Extract CGPA/Percentage into "grade".
      4. Skills: Extract as an array of strings.
      
      JSON Structure:
      {
        "name": "Full Name",
        "bio": "Extracted or Generated Summary",
        "skills": ["Skill1", "Skill2"],
        "education": [{ "school": "", "degree": "", "field": "", "startYear": "", "endYear": "", "grade": "" }],
        "experience": [{ "company": "", "position": "", "description": "", "startDate": "", "endDate": "" }],
        "projects": [{ "title": "", "description": "", "link": "" }]
      }
    `;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    return { success: true, data: JSON.parse(result.response.text()) };
  } catch (error: any) {
    return { error: "AI Parsing failed. Please fill manually." };
  }
}