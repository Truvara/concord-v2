# Concord-v2 Documentation

## Product Overview
Concord-v2 is a comprehensive consent management platform designed to help organizations manage user consents, preferences, and privacy choices while maintaining compliance with privacy regulations. The platform provides a robust framework for collecting, storing, and managing consent across different applications and platforms.

## Core Modules

### 1. Consent Management
- Track and manage user consents across different platforms
- Monitor consent collection status (Granted, Revoked, Pending)
- Geolocation tracking for consent collection
- Timestamp tracking for consent lifecycle
- Subject identity management
- Real-time consent status monitoring

### 2. Forms Management
- Create and manage dynamic consent forms
- Support for both web and mobile platforms
- Customizable form configurations using JSON schema
- Form ownership and permissions management
- Integration with purposes and entities
- Form endpoint management
- Configurable expiration durations
- Subject identifier type customization

### 3. Purpose Management
- Define and track data processing purposes
- Purpose categorization and description
- Configurable duration and expiration settings
- Mandatory consent flags
- Reconsent requirements configuration
- Revocation rights management
- Data type specification
- Third-party sharing controls
- Retention period management

### 4. Entity Management
- Organization/entity profile management
- Entity description and categorization
- Line of business tracking
- Consent point of contact management
- Entity-purpose relationship management

### 5. Preferences Management
- Application-specific preference management
- Version control for preference centers
- Form-specific preference settings
- JSON schema-based configuration
- App version tracking

### 6. Notice Management
- Privacy notice creation and management
- Version control for notices
- Publication status tracking
- Co-owner and approver management
- Notice linking capabilities
- Organization management integration

## Technical Specifications

### Frontend Technology Stack
- **Framework**: Next.js 14 with React 18
- **UI Framework**: Material-UI (MUI) v6
- **State Management**: Refine Framework
- **Form Handling**: React Hook Form
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **Type Safety**: TypeScript

### Backend Database Schema
- PostgreSQL database with the following main tables:
  - entity
  - purpose
  - forms
  - preferences
  - consents
  - notice

### Key Features
1. **Dynamic Form Builder**
   - JSON-based form configuration
   - Real-time form preview
   - Multiple form element types support
   - Responsive design support

2. **Advanced Consent Tracking**
   - Consent status monitoring
   - Audit trail capabilities
   - Geolocation tracking
   - Timestamp tracking

3. **Flexible Purpose Management**
   - Purpose categorization
   - Duration management
   - Data type tracking
   - Third-party sharing controls

4. **Comprehensive Dashboard**
   - Consent status visualization
   - Form usage analytics
   - Purpose distribution charts
   - Entity-wise consent tracking

5. **Permission Management**
   - Role-based access control
   - Form-level permissions
   - Entity-level access control
   - User management

6. **Version Control**
   - Notice versioning
   - Preference center versioning
   - Form configuration versioning

