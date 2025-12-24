# SMS Monitor – Web Portal Requirement Document

**Document Type:** Web Application Functional & Technical Requirements  
**Audience:** Web Developer (Vite + Vue)  
**Project:** SMS Monitor  
**Environment:** Internal QA / Non-Production  
**Authentication:** Google OAuth  
**Backend:** Supabase  

---

## 1. Purpose

The purpose of the **SMS Monitor Web Portal** is to provide QA team members with a secure, centralized interface to view SMS messages (e.g., OTPs) received on QA SIM cards and forwarded by the SMS Monitor Android app.

The portal enables parallel QA testing by removing dependency on the physical SIM holder.

---

## 2. Scope

### 2.1 In Scope
- Web portal built using Vite + Vue
- Google Authentication (OAuth)
- Secure access to SMS data stored in Supabase
- Near real-time SMS visibility
- Read-only access to SMS records
- Internal QA usage only

### 2.2 Out of Scope
- Manual SMS insertion or editing
- SMS deletion from portal
- User management beyond Google Auth
- Production usage
- Mobile-first UI (desktop-first is acceptable)

---

## 3. Target Users

- QA Engineers  
- QA Leads  
- Internal Test Managers  

---

## 4. Authentication and Authorization

### 4.1 Authentication (Google Auth)
- The portal shall use Google OAuth for user authentication.
- Google Auth shall be integrated with Supabase authentication.
- Users must sign in using a Google account to access the portal.
- Login and logout functionality shall be supported.

### 4.2 Authorization
- Only authenticated users can access protected routes.
- Users shall have read-only access to SMS data.
- Role-based access control is not required in the initial scope.

---

## 5. Functional Requirements

### 5.1 Login Flow
- User opens the SMS Monitor web portal.
- User is prompted to sign in using Google.
- After successful login, the user is redirected to the dashboard.
- Unauthenticated users shall not be able to access dashboard routes.

---

### 5.2 Dashboard – SMS Viewer

The dashboard is the primary screen of the application.

#### Features
- Display a list of latest SMS messages.
- Messages shall be ordered by newest first.
- Each SMS entry shall display:
  - Received timestamp
  - Sender
  - Message body
  - MSISDN (full or masked based on configuration)

---

### 5.3 Filtering and Search
- Filter SMS by sender.
- Filter SMS by MSISDN (if multiple numbers exist).
- Keyword search within SMS message body (e.g., OTP).

---

### 5.4 OTP Usability
- OTP values should be clearly readable.
- Provide copy-to-clipboard functionality for SMS text.
- Optional visual highlighting for numeric OTP patterns.

---

### 5.5 Empty and Error States
- Show appropriate messages when:
  - No SMS data is available
  - Backend is unreachable
  - User session expires
- Display user-friendly error messages.

---

## 6. Data Source and API Usage

### 6.1 Data Source
- Supabase PostgreSQL database
- Table: sms_messages

### 6.2 Read Operations
- Fetch SMS data using Supabase client SDK.
- Only SELECT operations are allowed.
- Insert, update, or delete operations are not allowed from the web portal.

---

## 7. Non-Functional Requirements

### 7.1 Security
- Google Auth is mandatory.
- Supabase service role keys must never be exposed.
- Use Supabase public client keys only.
- HTTPS must be enforced.
- Do not log sensitive data to browser console.

---

### 7.2 Performance
- Fast initial page load.
- Efficient rendering of SMS lists.
- Pagination or message limits if volume increases.

---

### 7.3 Reliability
- Graceful handling of network errors.
- Proper handling of expired authentication sessions.
- Clear fallback UI for backend downtime.

---

## 8. UI and UX Requirements

### 8.1 General UI
- Clean, minimal, QA-focused design.
- Desktop-first layout is acceptable.

### 8.2 Header
- Application title: SMS Monitor
- Logged-in user indicator (Google account)
- Logout option

### 8.3 SMS List View
Each SMS row/card should show:
- Timestamp
- Sender
- Message content
- Copy button

---

## 9. Data Handling Rules

- SMS data is read-only.
- No local persistence beyond browser session.
- Respect backend data retention (messages may auto-expire).

---

## 10. Assumptions

- Users have Google accounts.
- Supabase Google Auth provider is configured.
- Row Level Security (RLS) is enforced on backend.
- Users are internal QA staff.

---

## 11. Constraints and Limitations

- Internal QA usage only.
- No production data.
- No admin/configuration UI in current scope.
- No offline support.

---

## 12. Compliance Note

For Internal QA Use Only.  
Not for Production or Public Access.

---

## 13. Summary

The SMS Monitor Web Portal is a secure, read-only QA dashboard that provides centralized visibility of SMS messages received on QA SIM cards. By using Google authentication and Supabase, the portal enables efficient, parallel QA testing without dependency on physical SIM access.
