import { companyData } from "../data/companyData";

export function searchCompanyData(query: string): string {
  if (!query || typeof query !== "string") {
    return "";
  }

  const queryLower = query.toLowerCase();
  let relevantInfo: string[] = [];

  // Search in products
  companyData.products.forEach((product) => {
    if (
      queryLower.includes("product") ||
      queryLower.includes(product.name.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(queryLower.split(" ").find((word) => word.length > 3) || "")
    ) {
      relevantInfo.push(
        `Product: ${product.name} - ${product.description}. Price: ${
          product.price
        }. Features: ${product.features.join(", ")}`
      );
    }
  });

  // Search in services
  companyData.services.forEach((service) => {
    if (
      queryLower.includes("service") ||
      queryLower.includes("consulting") ||
      queryLower.includes(service.name.toLowerCase()) ||
      service.description
        .toLowerCase()
        .includes(queryLower.split(" ").find((word) => word.length > 3) || "")
    ) {
      relevantInfo.push(
        `Service: ${service.name} - ${service.description}. Duration: ${service.duration}. Starting price: ${service.startingPrice}`
      );
    }
  });

  // Search in contact info
  if (
    queryLower.includes("contact") ||
    queryLower.includes("phone") ||
    queryLower.includes("email") ||
    queryLower.includes("address") ||
    queryLower.includes("hours") ||
    queryLower.includes("support")
  ) {
    relevantInfo.push(`Contact Information:
    Phone: ${companyData.contact.phone}
    Email: ${companyData.contact.email}
    Address: ${companyData.contact.address}
    Business Hours: ${companyData.contact.hours}
    Support: ${companyData.contact.support}`);
  }

  // Search in policies
  if (
    queryLower.includes("policy") ||
    queryLower.includes("return") ||
    queryLower.includes("refund") ||
    queryLower.includes("privacy") ||
    queryLower.includes("support")
  ) {
    relevantInfo.push(`Company Policies:
    Return Policy: ${companyData.policies.returnPolicy}
    Support Policy: ${companyData.policies.supportPolicy}
    Privacy Policy: ${companyData.policies.privacyPolicy}
    Refund Policy: ${companyData.policies.refundPolicy}`);
  }

  // Search in FAQ
  companyData.faq.forEach((faq) => {
    if (
      queryLower.includes(
        faq.question
          .toLowerCase()
          .split(" ")
          .find((word) => word.length > 3) || ""
      ) ||
      faq.answer
        .toLowerCase()
        .includes(queryLower.split(" ").find((word) => word.length > 3) || "")
    ) {
      relevantInfo.push(`FAQ: ${faq.question} - ${faq.answer}`);
    }
  });

  // If no specific matches, include general company info
  if (
    relevantInfo.length === 0 ||
    queryLower.includes("company") ||
    queryLower.includes("about")
  ) {
    relevantInfo.unshift(
      `Company: ${companyData.name} - ${companyData.description}`
    );
  }

  return relevantInfo.length > 0 ? relevantInfo.join("\n\n") : "";
}

export function isCompanyRelatedQuery(query: string): boolean {
  // Add type checking for safety
  if (!query || typeof query !== "string") {
    return false;
  }

  const companyKeywords = [
    "product",
    "service",
    "price",
    "pricing",
    "contact",
    "support",
    "policy",
    "company",
    "about",
    "help",
    "techcorp",
    "cloudsync",
    "dataviz",
    "secureauth",
    "consulting",
    "migration",
    "security",
    "hours",
    "phone",
    "email",
  ];

  const queryLower = query.toLowerCase();
  return companyKeywords.some((keyword) => queryLower.includes(keyword));
}
