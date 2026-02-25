# Login Modal Redesign - Implementation Plan

## Status: IN PROGRESS

## Information Gathered:
- Existing login page at `web/login/login.html` with basic white card design
- Current fields: username, password (need to change to email)
- Uses Fetch API for backend authentication
- Font currently Segoe UI, needs to switch to Inter/Poppins
- Existing CSS: `web/login/login.css`
- JS: `web/login/login.js` handles form submissions

## Plan:

### Step 1: Update login.html
- Add Google Fonts (Inter/Poppins)
- Create modal structure with glass effect
- Add close (X) button at top-right
- Add toggle pills for "Sign up" / "Sign in" (Sign in active)
- Change username field to Email with icon
- Add password field with eye toggle icon
- Update heading to "Welcome back"
- Update subtext to "Sign in to continue"
- Add "Forgot password?" link
- Add footer text "Don't have an account? Sign up"

### Step 2: Update login.css
- Background: dark gradient (black → deep purple)
- Modal: glass-morphism with backdrop blur
- Modal dimensions: 420px width, 24px border-radius
- Soft neon purple accent throughout
- Input fields: semi-transparent dark, inner glow
- Button: bright purple gradient with glow effect
- Hover effects on button
- Mobile responsive styles

### Step 3: Update login.js
- Adapt to new field IDs (email instead of username)
- Maintain existing authentication logic
- Add toggle functionality between Sign in/Sign up

## Files to Edit:
1. `web/login/login.html`
2. `web/login/login.css`
3. `web/login/login.js`

## Followup Steps:
- Test the login functionality
- Verify mobile responsiveness

