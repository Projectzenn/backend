export type CompanyDetailsResult = {
    name: string,
    owner: string,
    description: string, 
    image: string,
    details: any, 
    email: string,
    type: "company" | "education" | "community", 
    urls:string[],
  }
  