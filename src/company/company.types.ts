import { CompanyDetailsResult } from "src/chain/chain.types"
export type CompanyDetails = {
    owners: string[],
    details: CompanyDetailsResult,
    address:string
}