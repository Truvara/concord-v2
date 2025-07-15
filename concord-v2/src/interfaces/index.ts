export interface IConsent {
    id: string;
    subject_identity: string;
    geolocation: string;
    consent_source: string;
    processing_purpose: string;
    consent_purpose: string;
    consent_status: 'GRANTED' | 'DECLINED';
    consent_date: string;
    consent_collected: string;
    created_at: string;
    updated_at: string;
} 