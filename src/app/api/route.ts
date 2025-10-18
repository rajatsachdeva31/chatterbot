import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  searchCompanyData,
  isCompanyRelatedQuery,
} from "../../utils/companySearch";
import { companyData } from "../../data/companyData";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    // Validate that userMessage exists and is a string
    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        {
          output: {
            role: "assistant",
            content:
              "Please provide a valid message. How can I help you with TechCorp Solutions today?",
          },
        },
        { status: 400 }
      );
    }

    // Check if the query is company-related
    if (!isCompanyRelatedQuery(userMessage)) {
      return NextResponse.json(
        {
          output: {
            role: "assistant",
            content:
              "I'm a customer service assistant for TechCorp Solutions. I can only help with questions about our products, services, pricing, policies, and company information. How can I assist you with TechCorp Solutions today?",
          },
        },
        { status: 200 }
      );
    }

    // Retrieve relevant company information
    const relevantContext = searchCompanyData(userMessage);

    const systemPrompt = `You are a customer service assistant for ${companyData.name}. 
Your role is to help customers with questions about our company, products, services, pricing, and policies.

IMPORTANT INSTRUCTIONS:
- Only answer questions related to ${companyData.name} using the provided company information
- Be helpful, professional, and concise
- If you don't have specific information in the context provided, say "I don't have that specific information. Please contact our support team at ${companyData.contact.support} or call ${companyData.contact.phone}"
- Do not make up information that's not in the provided context
- Always stay in character as a ${companyData.name} representative

COMPANY INFORMATION:
${relevantContext}

Please provide a helpful response based on this information.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log(completion.choices[0].message);
    const theResponse = completion.choices[0].message;

    return NextResponse.json({ output: theResponse }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        output: {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error. Please try again or contact our support team.",
        },
      },
      { status: 500 }
    );
  }
}
