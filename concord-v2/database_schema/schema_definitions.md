## entity

create table
  public.entity (
    id uuid not null default gen_random_uuid (),
    entity_name character varying(100) not null,
    entity_description character varying(255) not null,
    line_of_business character varying(100) not null,
    consent_poc character varying(100) null,
    constraint entity_pkey primary key (id)
  ) tablespace pg_default;

## purpose

create table
  public.purpose (
    id uuid not null default gen_random_uuid (),
    purpose character varying(255) not null,
    purpose_duration integer not null,
    processing_purpose character varying(255) not null,
    is_mandatory boolean not null default false,
    is_reconsent_by_principal boolean not null default false,
    is_revocable_by_principal boolean not null default false,
    purpose_description text null,
    purpose_category character varying(100) null,
    frequency_interval integer null,
    expiration_date timestamp without time zone null,
    data_types character varying(255) [] null,
    third_party_sharing boolean null default false,
    retention_period integer null,
    last_updated timestamp without time zone null default current_timestamp,
    created_at timestamp without time zone null default current_timestamp,
    entity_ids uuid[] null default '{}'::uuid[],
    constraint purpose_pkey primary key (id)
  ) tablespace pg_default;

## forms

create table
  public.forms (
    id uuid not null default gen_random_uuid (),
    form_name character varying(255) not null,
    endpoint character varying(255) not null,
    subject_identifier_type character varying(50) null,
    consent_field_type character varying(50) null,
    consent_purpose_type character varying(50) null,
    form_trigger_type character varying(50) null,
    expiration_duration integer null,
    json_configuration jsonb not null,
    form_owner_primary character varying(255) not null,
    form_owner_secondary character varying(255) null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    form_type character varying(20) not null default 'web'::character varying,
    permissions jsonb null default '[]'::jsonb,
    purpose_ids uuid[] null default '{}'::uuid[],
    constraint consent_forms_pkey primary key (id),
    constraint platform_check check (
      (
        (form_type)::text = any (
          array[
            ('web'::character varying)::text,
            ('mobile'::character varying)::text
          ]
        )
      )
    )
  ) tablespace pg_default;

## preferences

create table
  public.preferences (
    id uuid not null default gen_random_uuid (),
    app_identifier character varying(255) not null,
    preference_center_version character varying(50) null,
    form_identifier character varying(255) not null,
    form_settings jsonb null,
    json_schema jsonb null,
    app_version character varying(50) null,
    last_updated timestamp with time zone null default current_timestamp,
    constraint preferences_pkey primary key (id),
    constraint preferences_app_identifier_form_identifier_key unique (app_identifier, form_identifier)
  ) tablespace pg_default;

## consents

create table
  public.consents (
    id uuid not null default gen_random_uuid (),
    subject_identity character varying(255) not null,
    geolocation character varying(100) null,
    consent_status character varying(20) not null,
    consent_date timestamp with time zone null default current_timestamp,
    consent_collected timestamp with time zone null default current_timestamp,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    form_id uuid not null,
    purpose_id uuid not null,
    constraint consents_pkey primary key (id),
    constraint fk_form_id foreign key (form_id) references forms (id) on delete cascade,
    constraint fk_purpose_id foreign key (purpose_id) references purpose (id) on delete cascade,
    constraint consents_consent_status_check check (
      (
        (consent_status)::text = any (
          (
            array[
              'GRANTED'::character varying,
              'REVOKED'::character varying,
              'PENDING'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

create index if not exists idx_consents_subject_identity on public.consents using btree (subject_identity) tablespace pg_default;

create index if not exists idx_consents_form_id on public.consents using btree (form_id) tablespace pg_default;

create index if not exists idx_consents_purpose_id on public.consents using btree (purpose_id) tablespace pg_default;

## notice

create table
  public.notice (
    id serial not null,
    name character varying(255) not null,
    status character varying(20) not null,
    published_date timestamp with time zone null,
    version character varying(50) null,
    notice_links json null,
    managing_organization json null,
    co_owners character varying(255) [] null,
    approvers character varying(255) [] null,
    constraint notice_pkey primary key (id),
    constraint notice_status_check check (
      (
        (status)::text = any (
          (
            array[
              'draft'::character varying,
              'published'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;