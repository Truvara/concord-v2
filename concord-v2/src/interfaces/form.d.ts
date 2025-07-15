export interface IForm {
  id: string;
  form_name: string;
  endpoint: string;
  subject_identifier_type: string | null;
  consent_field_type: string | null;
  consent_purpose_type: string | null;
  form_trigger_type: string | null;
  expiration_duration: number | null;
  json_configuration: any;
  form_owner_primary: string;
  form_owner_secondary: string | null;
  created_at: string | null;
  updated_at: string | null;
  purpose_id: string | null;
  entity_id: string | null;
  form_type: 'web' | 'mobile';
}

export interface IPurpose {
  id: string;
  purpose: string;
  purpose_description: string;
  purpose_duration: number;
  // ... other purpose fields
}

export interface IEntity {
  id: string;
  entity_name: string;
  entity_description: string;
  line_of_business: string;
  consent_poc: string | null;
} 