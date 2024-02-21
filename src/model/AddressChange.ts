export interface ChangeAddress {
  status?: 'unknown' | 'valid' | 'invalid' | 'change';
  changes?: {
    streetAddress?: string;
    secondaryAddress?: string;
    city?: string;
    state?: string;
    ZIPCode?: string;
    ZIPPLus4?: string;
    urbanization?: string;
  }

}